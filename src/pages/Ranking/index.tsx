import UserRankList from '@/containers/UserRankList';
import Icon from '@/components/Icon';
import * as S from './style';

function Ranking() {
  const iconProps = {
    name: 'search',
    size: 20,
    strokeWidth: 2,
    color: '#222',
    rotate: 0,
  };

  return (
    <div>
      <S.SearchContainer>
        <S.SearchWrap>
          <Icon {...iconProps} />
          <S.SearchInput type="text" placeholder="Search" />
        </S.SearchWrap>
      </S.SearchContainer>
      <S.Wrap>
        <S.Container>
          <S.Rank>순위</S.Rank>
          <S.Exp>경험치</S.Exp>
          <S.UserInfoWrap>유저정보</S.UserInfoWrap>
        </S.Container>
        <S.UserInfoContainer>
          <UserRankList />
        </S.UserInfoContainer>
      </S.Wrap>
    </div>
  );
}

export default Ranking;