import { useEffect, useRef } from 'react';
import { QUIZ_ITEM_DEFAULT_STATE } from '@/assets/QuizCreateMockData';
import Icon from '@/components/Icon';
import { QuizClientContent } from '@/interfaces/Quiz';
import QuizItem from '../QuizItem';
import * as S from './styles';

interface QuizListProps {
  quizList: QuizClientContent[];
  setQuizList: React.Dispatch<React.SetStateAction<QuizClientContent[]>>;
}
function QuizList({ quizList, setQuizList }: QuizListProps) {
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
    setQuizList(quizList.filter((quiz) => quiz._id !== id));
  };
  const handleQuizChange = (id: number, key: string, value: string) => {
    setQuizList(
      quizList.map((quiz) =>
        quiz._id === id ? { ...quiz, [key]: value } : quiz,
      ),
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
  }, [moveController.current]);

  return (
    <S.QuizListContainer>
      {quizList.map((quiz, idx) => (
        <QuizItem
          quizData={quiz}
          key={quiz._id}
          order={idx + 1}
          onChangeQuiz={handleQuizChange}
          handleQuizDelete={handleQuizDelete}
        />
      ))}
      <S.InsertQuizItem
        ref={insertButtonRef}
        type="button"
        onClick={handleQuizAdd}
      >
        <Icon name="plus-circle" size={24} />
        퀴즈 추가하기
      </S.InsertQuizItem>
    </S.QuizListContainer>
  );
}
export default QuizList;
