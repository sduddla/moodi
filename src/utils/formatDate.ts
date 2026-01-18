export const formDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const shouldShowDateDivider = (currentTimestamp: number, previousTimestamp: number) => {
  const current = new Date(currentTimestamp);
  const previous = new Date(previousTimestamp);

  return (
    current.getFullYear() !== previous.getFullYear() ||
    current.getMonth() !== previous.getMonth() ||
    current.getDate() !== previous.getDate()
  )
}