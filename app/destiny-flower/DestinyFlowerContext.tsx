"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import {
  buildDivinationResults,
  buildTarotSpread,
  deriveDivinationInput,
  extractDestinySignals,
  resolveFinalDestinyFlower,
} from "./flowerData";
import { getCurrentDestinyProfile, subscribeDestinyProfileChange } from "./profileBridge";
import { DestinyFlowerState, DestinyProfile, DiscoveryPhaseKey } from "./types";

type Action =
  | { type: "hydrate_profile"; payload: DestinyProfile | null }
  | { type: "confirm_phase"; payload: { phase: DiscoveryPhaseKey } }
  | { type: "run_analysis" }
  | { type: "pick_tarot"; payload: { cardId: string } }
  | { type: "restart" };

interface DestinyFlowerContextValue extends DestinyFlowerState {
  reloadProfile: () => void;
  confirmPhase: (phase: DiscoveryPhaseKey) => void;
  runAnalysis: () => void;
  pickTarot: (cardId: string) => void;
  restart: () => void;
}

const INITIAL_PHASE_CONFIRMED: Record<DiscoveryPhaseKey, boolean> = {
  saju: false,
  ziweiSukuyo: false,
  astrology: false,
};

const initialState: DestinyFlowerState = {
  profileStatus: "loading",
  profile: undefined,
  analysis: {
    input: undefined,
    discovery: undefined,
    phaseConfirmed: { ...INITIAL_PHASE_CONFIRMED },
    results: [],
  },
  tarot: {
    spread: [],
    picked: undefined,
    finalFlower: undefined,
  },
  stage: "input",
};

function reducer(state: DestinyFlowerState, action: Action): DestinyFlowerState {
  switch (action.type) {
    case "hydrate_profile": {
      if (!action.payload) {
        return {
          ...initialState,
          profileStatus: "missing",
        };
      }

      const input = deriveDivinationInput(action.payload);
      const discovery = extractDestinySignals(input);

      return {
        ...initialState,
        profileStatus: "ready",
        profile: action.payload,
        analysis: {
          input,
          discovery,
          phaseConfirmed: { ...INITIAL_PHASE_CONFIRMED },
          results: [],
        },
      };
    }

    case "confirm_phase": {
      if (state.stage !== "input") return state;

      const phaseOrder: DiscoveryPhaseKey[] = ["saju", "ziweiSukuyo", "astrology"];
      const targetIndex = phaseOrder.indexOf(action.payload.phase);
      const prerequisiteSatisfied = phaseOrder
        .slice(0, targetIndex)
        .every((phase) => state.analysis.phaseConfirmed[phase]);

      if (!prerequisiteSatisfied) return state;

      return {
        ...state,
        analysis: {
          ...state.analysis,
          phaseConfirmed: {
            ...state.analysis.phaseConfirmed,
            [action.payload.phase]: true,
          },
        },
      };
    }

    case "run_analysis": {
      if (!state.profile) {
        return {
          ...state,
          profileStatus: "missing",
        };
      }

      const isDiscoveryCompleted = Object.values(state.analysis.phaseConfirmed).every(Boolean);
      if (!isDiscoveryCompleted) {
        return state;
      }

      const input = state.analysis.input ?? deriveDivinationInput(state.profile);
      const results = buildDivinationResults(input);
      const tarotSpread = buildTarotSpread(input.baseSeed, input, 22);

      return {
        ...state,
        analysis: {
          ...state.analysis,
          input,
          results,
        },
        tarot: {
          spread: tarotSpread,
          picked: undefined,
          finalFlower: undefined,
        },
        stage: "tarot",
      };
    }

    case "pick_tarot": {
      const pickedTarot = state.tarot.spread.find((card) => card.id === action.payload.cardId);
      if (!pickedTarot || !state.analysis.input) return state;

      const finalFlower = resolveFinalDestinyFlower(state.analysis.input, state.analysis.results, pickedTarot);

      return {
        ...state,
        tarot: {
          ...state.tarot,
          picked: pickedTarot,
          finalFlower,
        },
        stage: "final",
      };
    }

    case "restart":
      if (!state.profile) {
        return {
          ...initialState,
          profileStatus: "missing",
        };
      }

      const refreshedInput = deriveDivinationInput(state.profile);

      return {
        ...state,
        analysis: {
          input: refreshedInput,
          discovery: extractDestinySignals(refreshedInput),
          phaseConfirmed: { ...INITIAL_PHASE_CONFIRMED },
          results: [],
        },
        tarot: {
          spread: [],
          picked: undefined,
          finalFlower: undefined,
        },
        stage: "input",
      };

    default:
      return state;
  }
}

const DestinyFlowerContext = createContext<DestinyFlowerContextValue | null>(null);

export function DestinyFlowerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reloadProfile = useCallback(() => {
    dispatch({ type: "hydrate_profile", payload: getCurrentDestinyProfile() });
  }, []);

  useEffect(() => {
    reloadProfile();
    const unsubscribe = subscribeDestinyProfileChange((profile) => {
      dispatch({ type: "hydrate_profile", payload: profile });
    });

    return unsubscribe;
  }, [reloadProfile]);

  const value = useMemo<DestinyFlowerContextValue>(
    () => ({
      ...state,
      reloadProfile,
      confirmPhase: (phase: DiscoveryPhaseKey) => dispatch({ type: "confirm_phase", payload: { phase } }),
      runAnalysis: () => dispatch({ type: "run_analysis" }),
      pickTarot: (cardId: string) => dispatch({ type: "pick_tarot", payload: { cardId } }),
      restart: () => dispatch({ type: "restart" }),
    }),
    [reloadProfile, state],
  );

  return <DestinyFlowerContext.Provider value={value}>{children}</DestinyFlowerContext.Provider>;
}

export function useDestinyFlower() {
  const ctx = useContext(DestinyFlowerContext);
  if (!ctx) {
    throw new Error("useDestinyFlower must be used within DestinyFlowerProvider");
  }
  return ctx;
}
