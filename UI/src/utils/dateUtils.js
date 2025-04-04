export const formatDateWithDay = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.format('YYYY년 MM월 DD일')} (${days[date.day()]})`;
}; 