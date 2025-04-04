export async function chatClient(user_message, api, onMessageUpdate) {

    
    let backEndPort = "37777";

    try {
        const response = await fetch(`http://localhost:${backEndPort}/${api}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: user_message }),
        });
        if (!response.ok) throw new Error("Network response was not ok");

        // 스트림 데이터 읽기
        const reader = response.body.getReader();
        const decoder = new TextDecoder();


        let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // 데이터 해독 및 업데이트
            let chunk = decoder.decode(value, { stream: true });
            console.log(chunk)

            

            /**
             * 청크들을 합쳐 문자열로 만드는 부분.
             * 청크는 다음과 같은 형태들을 띌 수 있으며 -> 뒤에 처리 방법을 기제함
             * 
             * data:a  -> 문자 추가
             * 
             * data:   -> 띄어쓰기 추가
             * 
             * 
             * 다음과 같은 형태는 청크의 크기가 바뀌면 이상작동 할 수 있음
             * 
             * a       -> 이전에 추가된 띄어쓰기 제거 후 (문자열 마지막 한칸 제거) 문자 추가
             *            (반드시 data: 가 먼저 나옴 (현재 청크 크기에선))
             * 
             * (빈칸)  -> 무시
             */
            chunk = chunk.trim();
            //console.log(chunk)

            if (chunk.startsWith("data:")) { // data: 태그에 달려온 경우
                chunk = chunk.substring(6) // 스프링 서버 사용시 5로 변경해야 정상작동
                if (chunk == "") {
                    chunk = " ";
                }
            }
            else { // data: 태그에 달려오지 않은경우 (한칸 밀림)
                if (chunk != "") {
                    result = result.slice(0, -1);
                }
            }

            result += chunk;
            /**청크 관련 로직 끝 */

            onMessageUpdate(result); // 실시간으로 UI 업데이트
        }

        return result;

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}