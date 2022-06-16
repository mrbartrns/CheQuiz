import { useCallback } from 'react';
import { MAXEXP } from '@/common/number';
import * as S from './styles';
import {
  UserInfoMockList as userList,
  userQuizMockList as userQuizList,
  UserInfoMockData as userMockData,
} from '@/assets/UserInfoMockData';
import * as Breakpoints from './breakpoints';
import { BadgeType } from '@/interfaces/BadgeType';

interface userProps {
  id: string;
}

function UserInfoCard({ id }: userProps) {
  // TODO: id를 기반으로 비동기 API요청> userData 가져오기
  const userData = {
    id: userMockData._id,
    fullName: userMockData.fullName,
    likes: userMockData.likes,
    posts: userMockData.posts,
    comments: userMockData.comments,
    totalExp:
      userMockData && userMockData.username
        ? JSON.parse(userMockData.username).totalPoints
        : 0,
  };

  // TODO: 유저리스트 비동기 API요청 필요
  const getRank = useCallback(() => {
    const sortedUserList = userList
      .map((user) => ({
        id: user._id,
        fullName: user.fullName,
        points:
          user && user.username ? JSON.parse(user.username).totalPoints : 0,
      }))
      .sort((a, b) => {
        return b.points - a.points;
      });
    const rank = sortedUserList.findIndex((data) => data.id === id) + 1;
    return rank;
  }, [id]);

  // TODO: 유저가 작성한 퀴즈 정보 비동기 API요청 필요
  const getQuiz = () => {
    const modifiedQuiz = userQuizList.map((quiz) => {
      const customData = JSON.parse(quiz.title);
      return {
        id: quiz._id,
        category: customData.tag,
      };
    });
    return modifiedQuiz;
  };

  const level = Math.floor(userData.totalExp / MAXEXP) + 1;
  const currentExp = userData.totalExp - (level - 1) * MAXEXP;
  const expPercent = Math.floor((currentExp / MAXEXP) * 100);

  const getImage = useCallback(() => {
    let selectedId = Breakpoints.imageBreakpoints[0].imageId;
    Breakpoints.imageBreakpoints.forEach((breakpoint) => {
      if (level >= breakpoint.level) {
        selectedId = breakpoint.imageId;
      }
    });
    return selectedId;
  }, [level]);

  const getQuizCategoryCount = useCallback(() => {
    // 출제한 퀴즈 카테고리 별 뱃지
    const categoryMap = new Map();

    getQuiz().forEach((quiz) => {
      const { category } = quiz;
      const count = categoryMap.get(category);
      if (count) {
        categoryMap.set(category, count + 1);
      } else {
        categoryMap.set(category, 1);
      }
    });

    const categoryQuiz = Array.from(categoryMap).sort((a, b) => {
      if (a[1] <= b[1]) return 1;
      return -1;
    });

    return categoryQuiz;
  }, []);

  const getBadges = useCallback(() => {
    const badges: BadgeType[] = [];
    const userLevelBadges = Breakpoints.levelBreakpoints.filter((badge) => {
      return badge.level <= level;
    });
    const selectedLevelBadge = userLevelBadges[userLevelBadges.length - 1];
    badges.push({
      id: `badgeLevel${selectedLevelBadge.level}`,
      color: selectedLevelBadge.color,
      content: `${
        selectedLevelBadge.level !== 0
          ? `내가 레벨 ${selectedLevelBadge.level} 이라니!`
          : `뉴비`
      }`,
    });

    getQuizCategoryCount().forEach((quiz: [string, number], index) => {
      if (quiz[1] >= 10) {
        badges.push({
          id: `badgeCategory${index}`,
          content: `${quiz[0]}을 ${quiz[1] >= 50 ? '정복' : '시작'}한 자`,
        });
      }
    });

    // 댓글과 좋아요로 뱃지 가져오기
    Breakpoints.commentBreakpoints.forEach((breakpoint, index) => {
      const badge = {
        id: `badgeComment${index}`,
        color: breakpoint.color,
        content: breakpoint.text,
      };
      if (breakpoint.exact) {
        if (userData.comments.length === breakpoint.count) {
          badges.push(badge);
        }
      } else if (userData.comments.length >= breakpoint.count) {
        badges.push(badge);
      }
    });

    Breakpoints.likeBreakpoints.forEach((breakpoint, index) => {
      const badge = {
        id: `badgeLike${index}`,
        color: breakpoint.color,
        content: breakpoint.text,
      };
      if (breakpoint.exact) {
        if (userData.likes.length === breakpoint.count) {
          badges.push(badge);
        }
      } else if (userData.likes.length >= breakpoint.count) {
        badges.push(badge);
      }
    });

    Breakpoints.likeAndCommentBreakpoints.forEach((breakpoint, index) => {
      const badge = {
        id: `badgeLikeComment${index}`,
        color: breakpoint.color,
        content: breakpoint.text,
      };
      if (breakpoint.exact) {
        if (
          userData.likes.length === breakpoint.count &&
          userData.comments.length === breakpoint.count
        ) {
          badges.push(badge);
        }
      } else if (
        userData.likes.length >= breakpoint.count &&
        userData.comments.length >= breakpoint.count
      ) {
        badges.push(badge);
      }
    });
    return badges;
  }, [
    userData.comments.length,
    userData.likes.length,
    level,
    getQuizCategoryCount,
  ]);

  return (
    <S.UserCard>
      <S.UserBasicContent>
        <S.ImageWrapper>
          <S.UserImage
            src={`https://maplestory.io/api/GMS/210.1.1/mob/${getImage()}/render/stand`}
          />
        </S.ImageWrapper>

        <S.Username>{userData.fullName}</S.Username>
        <S.LevelText>Lv.{level}</S.LevelText>
      </S.UserBasicContent>

      <S.UserRankContent>
        <S.Rank>Rank : {getRank()}</S.Rank>

        <S.ExpWrapper>
          <S.ExpContainer>
            <S.ExpDetail>
              {currentExp}/{MAXEXP}
            </S.ExpDetail>
            <S.ExpCurrentContainer percent={expPercent} />
          </S.ExpContainer>
        </S.ExpWrapper>

        <S.BadgeContent>
          {getBadges().map((badge) => (
            <S.Badge
              color={badge.color ? badge.color : '#fffff'}
              key={badge.id}
            >
              {badge.content}
            </S.Badge>
          ))}
        </S.BadgeContent>
      </S.UserRankContent>
    </S.UserCard>
  );
}
export default UserInfoCard;
