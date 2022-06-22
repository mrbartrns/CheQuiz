import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import Home from '@/pages/Home';
import QuizCreate from '@/pages/QuizCreatePage';
import QuizResultPage from '@/pages/QuizResultPage';
import QuizSolvePage from '@/pages/QuizSolvePage';
import Error from '@/pages/ErrorPage';
import UserInfoPage from '@/pages/UserInfoPage';

// 라우터 추가 시 path가 '/'인 메인페이지는 제일 하단에 위치시켜주세요.
function Routers() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/create" component={QuizCreate} />
        <Route exact path="/result" component={QuizResultPage} />
        <Route path="/user" component={UserInfoPage} />
        <Route exact path="/solve" component={QuizSolvePage} />
        <Route path="/error" component={Error} />
        <Route path="/" component={Home} />
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routers;
