import React, { useEffect, useMemo, useState } from 'react';
import QuizResult from '@components/QuizResult';
import { useHistory } from 'react-router';
import { Quiz as QuizInterface } from '@/interfaces/Quiz';
import * as QuizServices from '@/api/QuizServices';
import * as S from './styles';
import { useSessionStorage } from '@/hooks/useStorage';
import { POST_IDS, USER_ANSWERS } from '@/constants';
import UserInfoCard from '@/components/UserInfo/UserInfoCard';
import { useAuthContext } from '@/contexts/AuthContext';
import Header from '@/components/Header';

/**
 * ANCHOR: QuizResultPage 로직
 * 1. sessionStorage에서 post-ids, user-answers를 불러온다.
 * 2. post-ids와 user-answers 개수를 확인하여 일치하지 않았다면 404페이지로 이동한다.
 * 3. 댓글을 달 수 있는 input과, 좋아요를 누를 수 있는 like가 각 컴포넌트에 위치하여야 한다.
 * 4. random인지, random인지 아닌지 저장해야 한다.
 */
function QuizResultPage() {
  const history = useHistory();
  const { user, isAuth } = useAuthContext();
  const [quizzes, setQuizzes] = useState<QuizInterface[]>([]);
  const [postIds] = useSessionStorage<string[]>(POST_IDS, []);
  const [userAnswers] = useSessionStorage<string[]>(USER_ANSWERS, []);
  const [loading, setLoading] = useState(true);
  // TODO: implement validation logics
  // if userAnswers.length !== userAnswers.filter(answer => answer).length -> 404page

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const qs = await QuizServices.getQuizzesFromPostIds(postIds);
        setQuizzes(qs);

        return qs;
      } catch (error) {
        throw new Error('error occured at fetchPosts');
      }
    };
    fetchPosts()
      .then((quizArray) => {
        if (!quizArray.length || quizArray.length !== userAnswers.length)
          history.replace('/error');
      })
      .finally(() => setLoading(false));
  }, [history, postIds, userAnswers.length]);
  if (loading) return null;
  return (
    <>
      <Header isLogin={isAuth} />
      {isAuth ? <UserInfoCard id={user._id} width="100%" /> : null}
      <S.QuizResultPage>
        {quizzes.map((quiz, index) => (
          <QuizResult
            key={quiz._id}
            quiz={quiz}
            correct={quiz.answer === userAnswers[index]}
          />
        ))}
        <div>
          <S.LinkButton to="/" color="point" fill="true">
            다른 문제 풀러가기
          </S.LinkButton>
          <S.LinkButton to="/ranking" color="point" fill="true">
            랭킹 보기
          </S.LinkButton>
          <S.LinkButton to="/create" color="point" fill="true">
            퀴즈 만들러 가기
          </S.LinkButton>
        </div>
      </S.QuizResultPage>
    </>
  );
}

export default QuizResultPage;
