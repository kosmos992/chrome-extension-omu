import styled from 'styled-components';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { useEffect } from 'react';
import useInput from '../../utils/useInput';
import ShadowBox from '../atoms/ShadowBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CenterLayout, RightBottomLayout } from '../atoms/Layouts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const PopUp = styled.div`
  z-index: 2;
  button {
    margin-right: -10px;
  }
`;
const Title = styled.h3`
  border-bottom: 1px solid #d4d4d4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  div {
    display: flex;
  }
`;
const InputWraper = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  label {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 8px;
  }
  span {
    font-size: 14px;
    font-weight: 500;
  }
  input {
    padding: 8px;
    width: 200px;
    border-radius: 20px;
  }
  button {
    width: 100px;
  }
`;
const Validation = styled.p`
  font-size: 13px;
  color: tomato;
  text-align: end;
  padding-right: 16px;
  margin-top: -8px;
  margin-bottom: 8px;
`;

const Bm = styled.div`
  line-height: 14px;
  font-size: 14px;
`;

const BookmarkCreate = ({ setAddBtnIsOpen, booksArr, setBookmarkArr }) => {
  const [bookName, bookNameBind, nameReset] = useInput('');
  const [bookUrl, bookUrlBind, urlReset] = useInput('');
  const [validation, setValidation] = useState();
  const [nameValidation, setNameValidation] = useState();

  const handleBookmarkClose = () => {
    setAddBtnIsOpen(false);
  };
  const urlRegex = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );

  useEffect(() => {
    const urlValidation = () => {
      urlRegex.test(bookUrl) ? setValidation(true) : setValidation(false);
    };
    urlValidation();
    const bookNames = booksArr.map(book => {
      return book.name;
    });
    const bookNameValidation = () => {
      bookNames.includes(bookName)
        ? setNameValidation(false)
        : setNameValidation(true);
    };
    bookNameValidation();
  }, [bookUrl, bookName]);

  const handleBookmarkSubmit = e => {
    e.preventDefault();
    if (booksArr.length < 10 && validation && nameValidation) {
      setBookmarkArr([
        ...booksArr,
        {
          name: bookName,
          url: bookUrl.includes('http') ? bookUrl : `https://${bookUrl}`,
        },
      ]);
      nameReset();
      urlReset();
      toast('???????????? ???????????????!');
    } else if (!validation || !nameValidation) {
      !validation ? toast('????????? url??? ????????????.') : null;
      !nameValidation ? toast('????????? ????????? ????????? ????????????.') : null;
    } else {
      toast('???????????? ??????????????? ????????? ??? ?????????!');
    }
  };
  useEffect(() => {
    localStorage.setItem('bookmark', JSON.stringify(booksArr));
  }, [booksArr]);
  return (
    <PopUp>
      <CenterLayout>
        <ShadowBox>
          <Title>
            <div>????????? ????????????</div>
            <FontAwesomeIcon icon={faXmark} onClick={handleBookmarkClose} />
          </Title>
          <InputWraper>
            <label htmlFor="name">
              <span>??????</span>
              <Input
                name="name"
                value={bookNameBind}
                border="shadow"
                color="#f6f6f6"
              />
            </label>
            {/* {nameValidation ? null : (
              <Validation>?????? ????????? ?????? ???????????? ?????????!</Validation>
            )} */}
            <label htmlFor="url">
              <span>URL</span>
              <Input
                name="url"
                value={bookUrlBind}
                border="shadow"
                color="#f6f6f6"
              />
            </label>
            {validation || !bookUrlBind.value.length ? null : (
              <Validation>????????? URL??? ????????????!</Validation>
            )}
            <RightBottomLayout>
              <Button
                size="long"
                onClick={handleBookmarkSubmit}
                disabled={!(bookName && bookUrl)}
              >
                ??????
              </Button>
            </RightBottomLayout>
          </InputWraper>
        </ShadowBox>
      </CenterLayout>
    </PopUp>
  );
};

export default BookmarkCreate;
