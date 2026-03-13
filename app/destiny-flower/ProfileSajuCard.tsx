import styles from "./destiny-flower.module.css";

interface ProfileSajuCardProps {
  profileName: string;
  birthText: string;
  calTypeLabel: string;
  locationLabel: string;
  dayStem: string;
  dailyStemBranch: string;
  isBirthTimeKnown: boolean;
}

export function ProfileSajuCard(props: ProfileSajuCardProps) {
  const {
    profileName,
    birthText,
    calTypeLabel,
    locationLabel,
    dayStem,
    dailyStemBranch,
    isBirthTimeKnown,
  } = props;

  return (
    <section className={styles.profileSajuCard} aria-label="프로필 사주 카드">
      <div className={styles.profileSajuHead}>
        <span>Profile to Saju</span>
        <strong>프로필 명식 데이터</strong>
      </div>

      <div className={styles.profileSajuGrid}>
        <article>
          <h4>이름</h4>
          <p>{profileName}</p>
        </article>
        <article>
          <h4>생년월일시</h4>
          <p>{birthText}</p>
        </article>
        <article>
          <h4>달력 기준</h4>
          <p>{calTypeLabel}</p>
        </article>
        <article>
          <h4>출생지</h4>
          <p>{locationLabel}</p>
        </article>
        <article>
          <h4>일간</h4>
          <p>{dayStem}</p>
        </article>
        <article>
          <h4>오늘 일진</h4>
          <p>{dailyStemBranch}</p>
        </article>
      </div>

      <small className={styles.profileSajuFootnote}>
        {isBirthTimeKnown
          ? "생시가 반영된 사주 팔자 데이터를 사용해 운명의 꽃을 계산했습니다."
          : "생시 미입력으로 평시(12:00) 보정 후 사주 팔자를 계산했습니다."}
      </small>
    </section>
  );
}
