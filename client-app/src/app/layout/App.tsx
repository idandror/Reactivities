import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import Loading from './Loading';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    //axios.get<Activity[]>('http://localhost:5000/api/activities')
    agent.Activities.list().then((response) => {
      console.log(response);
      let activities: Activity[] = [];
      activities = response.map((activity) => {
        activity.date = activity.date.split('T')[0];
        return activity;
      });
      console.log(activities);
      setActivities(response);
      setLoading(false);
    });
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find((x) => x.id === id));
  }
  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    }
    //activity.id
    //  ? setActivities([
    //      ...activities.filter((x) => x.id !== activity.id),
    //      activity,
    //    ])
    //  : setActivities([...activities, { ...activity, id: uuid() }]);
    //setEditMode(false);
    //setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter((x) => x.id !== id)]);
      setSubmitting(false);
    });
  }

  return (
    <>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/errors" element={<TestErrors />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer position="bottom-right" hideProgressBar />
    </>
  );
}

export default App;
