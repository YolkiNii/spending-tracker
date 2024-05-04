import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import useSpendings from '../hooks/useSpendings';
import SpendingInfo from './SpendingInfo';
import SpendingInfoEditor from './SpendingInfoEditor';

const SPENDING_URL = '/spendings';

const Spendings = () => {
  const { auth } = useAuth();
  const { spendingInfos, setSpendingInfos } = useSpendings();
  const [doUpdate, setDoUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editorIsOpen, setEditorIsOpen] = useState(false);
  const [selectedSpendingInfo, setSelectedSpendingInfo] = useState(null);
  const axiosPrivate = useAxiosPrivate();

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
            <>
              <h2>Your Spending</h2>
              {spendingInfos?.length ? (
                <ul>
                  {spendingInfos.map((spendingInfo, i) => (
                    <SpendingInfo
                      key={i}
                      spendingInfo={spendingInfo}
                      deleteInfo={() =>
                        deleteSpendingInfo(spendingInfo.spending_id)
                      }
                      openEditor={() => openSpendingInfoEditor(spendingInfo)}
                    />
                  ))}
                </ul>
              ) : (
                <p>No Spending Record</p>
              )}
              <button onClick={() => openSpendingInfoEditor(null)}>
                Add Entry
              </button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Spendings;
