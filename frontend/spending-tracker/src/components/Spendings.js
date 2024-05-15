import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import useSpendings from '../hooks/useSpendings';
import SpendingInfoEditor from './SpendingInfoEditor';
import { Container } from '@mui/material';
import SpendingDataGrid from './SpendingDataGrid';

const SPENDING_URL = '/spendings';

const Spendings = () => {
  const { auth } = useAuth();
  const { spendingInfos, setSpendingInfos } = useSpendings();
  const [doUpdate, setDoUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editorIsOpen, setEditorIsOpen] = useState(false);
  const [selectedSpendingInfo, setSelectedSpendingInfo] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  let dbRows = [];

  if (spendingInfos) {
    dbRows = spendingInfos.map((spendingInfo) => {
      const dateParts = spendingInfo.spending_date.split('-');
      const formattedDate =
        dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2].substr(0, 2);

      return {
        ...spendingInfo,
        id: spendingInfo.spending_id,
        spending_date: new Date(formattedDate)
      };
    });
  }

  useEffect(() => {
    const controller = new AbortController();

    const getSpendingInfos = async () => {
      try {
        const response = await axiosPrivate.get(
          SPENDING_URL + `/${auth.username}`,
          {
            signal: controller.signal
          }
        );
        setSpendingInfos(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getSpendingInfos();

    return () => {
      controller.abort();
    };
  }, [doUpdate]);

  const openSpendingInfoEditor = (spendingInfo) => {
    setSelectedSpendingInfo(spendingInfo);
    setEditorIsOpen(true);
  };

  const deleteSpendingInfo = async (id) => {
    // delete from database
    try {
      await axiosPrivate.delete(SPENDING_URL + `/${id}`);
    } catch (err) {
      console.log(err);
      return;
    }

    // let component know to re-pull data
    setDoUpdate((prev) => !prev);
  };

  return (
    <>
      {isLoading ? (
        <p>Is Loading</p>
      ) : (
        <>
          {editorIsOpen ? (
            <SpendingInfoEditor
              spendingInfo={selectedSpendingInfo}
              closeEditor={() => setEditorIsOpen(false)}
              doUpdate={() => setDoUpdate((prev) => !prev)}
            />
          ) : (
            <Container maxWidth='lg' sx={{ height: 600 }}>
              <h2>Your Spending</h2>
              <SpendingDataGrid
                dbRows={dbRows}
                doUpdate={() => setDoUpdate((prev) => !prev)}
              />
            </Container>
          )}
        </>
      )}
    </>
  );
};

export default Spendings;
