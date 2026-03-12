import { DestinyFlowerProvider } from "./DestinyFlowerContext";
import { FlowerFortuneContainer } from "./FlowerFortuneContainer";

export const metadata = {
  title: "나의 운명 꽃 · Code Destiny",
  description: "프로필 자동 연동 + 만세력 오행·자미두수·숙요·점성술·22장 꽃 타로로 완성하는 오늘의 운명 꽃",
};

export default function DestinyFlowerPage() {
  return (
    <DestinyFlowerProvider>
      <FlowerFortuneContainer />
    </DestinyFlowerProvider>
  );
}
