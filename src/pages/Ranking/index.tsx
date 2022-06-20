import { ChangeEvent, useState } from 'react';
import UserRankList from '@/containers/UserRankList';
import Icon from '@/components/Icon';
import * as S from './style';
import Header from '@/components/Header';
import { useAuthContext } from '@/contexts/AuthContext';

function Ranking() {
  const { isAuth } = useAuthContext();
  const iconProps = {
    name: 'search',
    size: 20,
    strokeWidth: 3,
    color: '#222',
    rotate: 0,
  };

  const [keyword, setKeyword] = useState('');

  const changeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value = '' } = e.target;
    setKeyword(value);
  };

  return (
    <div>
      <Header isLogin={isAuth} />
      <S.SearchContainer>
        <S.SearchWrap>
          <Icon {...iconProps} />
          <S.SearchInput
            type="text"
            placeholder="Search"
            onChange={changeKeyword}
          />
        </S.SearchWrap>
      </S.SearchContainer>
      <S.Wrap>
        <S.Container>
          <S.Rank>순위</S.Rank>
          <S.Exp>경험치</S.Exp>
          <S.UserInfoWrap>유저정보</S.UserInfoWrap>
        </S.Container>
        <UserRankList keyword={keyword} />
      </S.Wrap>
    </div>
  );
}

export default Ranking;
