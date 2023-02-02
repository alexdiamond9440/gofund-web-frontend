import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import Loader from '../src/components/Loader/index';
import Layout from './containers/Layout';
import Sidebar from './containers/Dashboard/Sidebar';
import ResetPassword from './containers/ResetPassword';
import VerifyUser from './containers/Login/ProxyVerify';
import './main.css';
import SponsorPage from './components/SponsorPage';
import { UserContext } from './contexts/UserContext';
import { createBrowserHistory } from 'history';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './store/reducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { scrollToTop } from 'helpers/scrollToTop';
import PrivacyPolicy from 'containers/PrivacyPolicy';
import TermsOfUse from 'containers/TermsOfUse';
const Login = lazy(() => import('./containers/Login'));
const Project = lazy(() => import('./containers/Start/Project'));
const Home = lazy(() => import('./components/Home'));
const Join = lazy(() => import('./containers/Join'));
const ForgotPassword = lazy(() => import('./containers/ForgotPassword'));
const ProjectList = lazy(() => import('./containers/ProjectList'));
const Main = lazy(() => import('./containers/Dashboard/Main'));
const MyProfile = lazy(() => import('./containers/Dashboard/MyProfile'));
const Coaching = lazy(() => import('./containers/Dashboard/Coaching'));
const DonationSetting = lazy(() => import('./containers/Dashboard/DonationSetting'));
const MyProjects = lazy(() => import('./containers/Dashboard/MyProjects'));
const MyLinks = lazy(() => import('./containers/Dashboard/MyLinks'));
const NotFound = lazy(() => import('./components/404'));
const ChangePassword = lazy(() => import('./containers/ChangePassword'));
const ChangeEmail = lazy(() => import('./containers/ChangeEmail'));
const Donate = lazy(() => import('./containers/Donate'));
const DonateConfirm = lazy(() => import('./containers/Donate/DonateConfirm'));
const BackedProject = lazy(() => import('./containers/Dashboard/BackedProject'));
const BackerList = lazy(() => import('./containers/Dashboard/BackerList'));
const Foundation = lazy(() => import('./containers/foundation'));
const ActiveDonar = lazy(() => import('./containers/Dashboard/ActiveDonar'));
const SentTransactions = lazy(() => import('./containers/Dashboard/sentTransactions'));
const ReceivedTransactions = lazy(() => import('./containers/Dashboard/receivedTransactions'));
const UserComponent = lazy(() => import('./containers/UserComponent'));
const ProjectDonation = lazy(() => import('./containers/Dashboard/ProjectDonation'));
const ProfileDonation = lazy(() => import('./containers/Dashboard/ProfileDonation'));
const ProfileList = lazy(() => import('./containers/ProfileList'));
const DonationsCollected = lazy(() => import('./containers/Dashboard/DonationCollected'));
const DeleteAccount = lazy(() => import('./containers/Dashboard/DeleteAccount'));
const ShopList = lazy(() => import('./containers/Shops'));
const history = createBrowserHistory();
const middleware = [thunkMiddleware, routerMiddleware(history)];
const store = createStore(rootReducer, applyMiddleware(...middleware));

const DefaultLayout = ({ component: Component, layout: LayoutC, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <LayoutC {...props}>
          <Suspense
            fallback={
              <div className="project-card router-loader">
                <Loader />
              </div>
            }>
            <Component {...props} />
          </Suspense>
        </LayoutC>
      )}
    />
  );
};

const RenderWithDashboardLayout = ({ component: Component, layout: LayoutC, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <LayoutC {...props}>
          <div>
            <div className="dashboardWrap clearfix">
              <div className="container">
                <section className="dashboard-page">
                  <nav className="breadcrumb"></nav>
                  <div className="row dashboard">
                    <div className="clearfix dashboard-width-wrap">
                      <Sidebar {...props} />
                      <Suspense
                        fallback={
                          <div className="col-md-10 col-sm-9 dashboard-right-warp">
                            <div className="project-card router-loader">
                              <Loader />
                            </div>
                          </div>
                        }>
                        <Component {...props} />
                      </Suspense>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </LayoutC>
      )}
    />
  );
};

const App = () => {
  const [user, setUser] = React.useState(null);
  useEffect(() => {
    const unListen = history.listen(scrollToTop);

    return unListen;
  }, []);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {}
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <DefaultLayout exact path="/" layout={Layout} component={Home} />
            {/* <DefaultLayout exact path="/about" layout={Layout} component={About} /> */}
            <DefaultLayout exact path="/login" layout={Layout} component={Login} />
            <DefaultLayout exact path="/join" layout={Layout} component={Join} />
            <DefaultLayout exact path="/404" layout={Layout} component={NotFound} />
            <DefaultLayout
              exact
              path="/forgot-password"
              layout={Layout}
              component={ForgotPassword}
            />
            <DefaultLayout exact path="/shop" layout={Layout} component={ShopList} />
            <Route path="/reset-password" component={ResetPassword} />
            <DefaultLayout exact path="/start" layout={Layout} component={Project} />
            <RenderWithDashboardLayout exact path="/dashboard" layout={Layout} component={Main} />
            <RenderWithDashboardLayout
              exact
              path="/my-profile"
              layout={Layout}
              component={MyProfile}
            />
            <RenderWithDashboardLayout
              exact
              path="/my-sponsor-pages"
              layout={Layout}
              component={MyProjects}
            />
            <RenderWithDashboardLayout exact path="/my-links" layout={Layout} component={MyLinks} />
            <RenderWithDashboardLayout
              exact
              path="/get-paid-now"
              layout={Layout}
              component={DonationSetting}
            />
            <RenderWithDashboardLayout
              exact
              path="/change-password"
              layout={Layout}
              component={ChangePassword}
            />
            <RenderWithDashboardLayout
              exact
              path="/change-email"
              layout={Layout}
              component={ChangeEmail}
            />
            <RenderWithDashboardLayout
              exact
              path="/coaching"
              layout={Layout}
              component={Coaching}
            />
            <RenderWithDashboardLayout
              exact
              path="/delete-account"
              layout={Layout}
              component={DeleteAccount}
            />
            <RenderWithDashboardLayout
              exact
              path="/transactions"
              layout={Layout}
              component={BackedProject}
            />
            <RenderWithDashboardLayout
              exact
              path="/money/sponsor-page"
              layout={Layout}
              component={ProjectDonation}
            />
            <RenderWithDashboardLayout
              exact
              path="/money/profile"
              layout={Layout}
              component={ProfileDonation}
            />
            <RenderWithDashboardLayout
              exact
              path="/money/sent"
              layout={Layout}
              component={SentTransactions}
            />
            <RenderWithDashboardLayout
              exact
              path="/money/received"
              layout={Layout}
              component={ReceivedTransactions}
            />
            <RenderWithDashboardLayout
              exact
              path="/money/active"
              layout={Layout}
              component={ActiveDonar}
            />
            <RenderWithDashboardLayout
              exact
              path="/my-sponsor-pages/backer-list/:projectUrl"
              layout={Layout}
              component={BackerList}
            />
            <DefaultLayout exact path="/search" layout={Layout} component={ProjectList} />
            <DefaultLayout exact path="/sponsors" layout={Layout} component={SponsorPage} />
            <RenderWithDashboardLayout
              exact
              path="/money/collected"
              layout={Layout}
              component={DonationsCollected}
            />
            <DefaultLayout exact path="/edit/:projectUrl" layout={Layout} component={Project} />
            <Route exact path="/verify-user" layout={Layout} component={VerifyUser} />
            <DefaultLayout exact path="/foundation" layout={Layout} component={Foundation} />
            <DefaultLayout exact path="/money/:projectUrl" layout={Layout} component={Donate} />
            <DefaultLayout
              exact
              path="/money/:projectUrl/:rewardId"
              layout={Layout}
              component={Donate}
            />
            <DefaultLayout
              exact
              path="/sponsor/profile/:profileUrl/:rewardId"
              layout={Layout}
              component={Donate}
            />
            <DefaultLayout exact path="/privacy-policy" layout={Layout} component={PrivacyPolicy} />
            <DefaultLayout exact path="/terms-of-use" layout={Layout} component={TermsOfUse} />

            <DefaultLayout
              exact
              path="/money-confirm/:checkout_id"
              layout={Layout}
              component={DonateConfirm}
            />
            <DefaultLayout exact path="/profiles" layout={Layout} component={ProfileList} />
            <DefaultLayout exact path="/:slug" layout={Layout} component={UserComponent} />
          </Switch>
        </Router>
        <ReduxToastr
          timeOut={6000}
          newestOnTop={false}
          preventDuplicates
          position="bottom-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar={true}
          closeOnToastrClick
        />
      </Provider>
    </UserContext.Provider>
  );
};

export default App;
