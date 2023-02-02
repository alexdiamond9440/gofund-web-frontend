/** @format */

import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import ProjectDetail from '../ProjectDetail';
import Userprofile from '../userprofile';
import Loader from '../../components/Loader';
import { UserContext } from 'contexts/UserContext';

const UserComponent = (props) => {
  const { match, history } = props;
  const [state, setState] = useState({ loading: false, redirectTo: '', data: '', userInfo: '' });
  const user = useContext(UserContext);

  const slug = match.params.slug;

  const getData = async (url) => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const {
        data: { data: responseData, success, redirectTo, userData, projectData }
      } = await axios.post('/users/getDetailsByURL', { url });
      if (success) {
        setState((prevState) => ({ ...prevState, redirectTo }));
        if (redirectTo === 'project') {
          const id = responseData.userId ?? '';
          if (responseData?.status === 'draft' && ((user && id !== user.userId) || !user)) {
            history.push('/404');
          } else {
            const { faq } = responseData;
            const faqData = faq ? JSON.parse(responseData.faq) : {};
            if (faqData && faqData.length) {
              faqData[0].open = true;
            }
            setState((prevState) => ({
              ...prevState,
              data: {
                ...responseData,
                faq: faqData
              },
              loading: false
            }));
          }
        } else {
          const newUserData = {
            user: userData,
            receivedId: userData.id,
            projects: projectData
          };
          setState((prevState) => ({ ...prevState, data: newUserData, loading: false }));
        }
      }
    } catch (err) {
      history.replace('/404');
    }
  };

  useEffect(() => {
    getData(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const isProject = state.redirectTo === 'project';
  const isProfile = !state.loading && !isProject;

  return (
    <>
      {state.loading && (
        <div className="project-card">
          <Loader />
        </div>
      )}
      {!state.loading && isProject && (
        <ProjectDetail data={state.data} getData={getData} {...props} />
      )}
      {!state.loading && isProfile && <Userprofile data={state.data} {...props} />}
    </>
  );
};

export default UserComponent;
