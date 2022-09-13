/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef } from 'react';

import { QUIZ_ITEM_DEFAULT_STATE } from '@/assets/QuizCreateMockData';
import Icon from '@/components/Icon';

import QuizItem from '../QuizItem';

import * as S from './styles';

import type { QuizClientContent } from '@/interfaces/Quiz';

interface QuizListProps {
  quizList: QuizClientContent[];
  setQuizList: React.Dispatch<React.SetStateAction<QuizClientContent[]>>;
  errors: any;
}
const QuizList = ({ quizList, setQuizList, errors }: QuizListProps) => {
  const moveController = useRef(false);

  const handleQuizAdd = () => {
    setQuizList([
      ...quizList,
      {
        ...QUIZ_ITEM_DEFAULT_STATE,
        _id: Math.max(...quizList.map((quiz) => quiz._id), 0) + 1,
      },
    ]);
    moveController.current = !moveController.current;
  };
  const handleQuizDelete = (id: number) => () => {
    if (quizList.length <= 1) return;
    setQuizList(quizList.filter((quiz) => quiz._id !== id));
  };
  const handleQuizChange = (id: number, key: string, value: unknown) => {
    setQuizList(
      quizList.map((quiz) =>
        quiz._id === id ? { ...quiz, [key]: value } : quiz
      )
    );
  };

  const insertButtonRef = useRef<HTMLButtonElement>(null);
  const scrollToBottom = () => {
    insertButtonRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <S.QuizListContainer>
      {quizList.map((quiz, idx) => (
        <QuizItem
          key={quiz._id}
          errors={errors}
          handleQuizDelete={handleQuizDelete}
          order={idx + 1}
          quizData={quiz}
          onChangeQuiz={handleQuizChange}
        />
      ))}
      <S.InsertQuizItem
        ref={insertButtonRef}
        type='button'
        onClick={handleQuizAdd}
      >
        <Icon
          name='plus-circle'
          size={24}
        />
        퀴즈 추가하기
      </S.InsertQuizItem>
    </S.QuizListContainer>
  );
};
export default QuizList;
