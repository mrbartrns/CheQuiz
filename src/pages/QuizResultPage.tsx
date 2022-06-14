import React, { useState } from 'react';
import { useSessionStorage } from '@hooks/useStorage';
import QuizResult from '@components/QuizResult';
import { USER_ANSWERS, POST_IDS } from '@/common/string';
import QuizMockData from '@/assets/QuizMockData';
/**
 * ANCHOR: QuizResultPage 로직
 * 1. sessionStorage에서 post-ids, user-answers를 불러온다.
 * 2. post-ids와 user-answers 개수를 확인하여 일치하지 않았다면 404페이지로 이동한다.
 * 3. 댓글을 달 수 있는 input과, 좋아요를 누를 수 있는 like가 각 컴포넌트에 위치하여야 한다.
 */
function QuizResultPage() {
  const [mockData, setMockData] = useState(QuizMockData);
  const [postIds, setPostIds] = useSessionStorage<string[]>(POST_IDS, []);
  const [userAnswers, setUserAnswers] = useSessionStorage<string[]>(
    USER_ANSWERS,
    Array(postIds.length).fill(''),
  );
  // TODO: implement validation logics
  // if userAnswers.length !== userAnswers.filter(answer => answer).length -> 404page
  return (
    <div>
      {mockData.map((mock, index) => (
        <>
          <div>{index + 1}번</div>
          <QuizResult
            key={mock._id}
            quiz={mock}
            correct={mock.answer === userAnswers[index]}
          />
        </>
      ))}
    </div>
  );
}

export default QuizResultPage;
