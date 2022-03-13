import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState } from 'react';
import { Button, FormField, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';

interface Props {
  activity: Activity | undefined;
  submitting: boolean;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => void;
}

const ActivityForm = ({
  activity: selectedActivity,
  submitting,
  closeForm,
  createOrEdit,
}: Props) => {
  const initialState = {
    id: '',
    title: '',
    date: '',
    category: '',
    description: '',
    city: '',
    venue: '',
  };
  //console.log(initialState);
  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description is required'),
    category: Yup.string().required(),
    date: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  const [activity, setActivity] = useState<Activity>(
    selectedActivity ? selectedActivity : initialState
  );

  //console.log(activity);

  //function handleSubmit() {
  //  console.log(activity);
  //  createOrEdit(activity);
  //}

  //function handleInputChange(
  //  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //) {
  //  const { name, value } = e.target;
  //  setActivity({ ...activity, [name]: value });
  //}
  return (
    <Segment clearing>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleSubmit }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat={'MMMM d, yyyy h:mm aa'}
            />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
              loading={submitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              onClick={closeForm}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default ActivityForm;
