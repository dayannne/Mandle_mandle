import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProfileImg from '../../../assets/img/basic-profile-img.svg';
import MoreBtn from '../../../assets/img/s-icon-more-vertical.svg';
import { UserAtom } from '../../../Store/userInfoAtoms';
import { useRecoilValue } from 'recoil';
import MoreButton from '../MoreButton';
import ReportModal from '../../Common/Modal/ReportModal';
import PostModal from '../Modal/PostModal';
import PostReportPost from '../../../api/PostReportPost';
import DeletePost from '../../../api/DeletePost';
import ModalAlert from '../../Common/Modal/ModalAlert/ModalAlert';
export default function PostProfile({ post, setPostUpdated }) {
  const userInfo = useRecoilValue(UserAtom); // UserAtom값 불러오기
  const [isModalOpen, setModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/profile/${post.author.accountname}`, {
      state: post.author.accountname,
    });
  };

  const handleClick = () => {
    setModalOpen(true);
  };

  const handleReportSubmit = async () => {
    const response = await PostReportPost(post.id, userInfo.token); // Call the API component
    if (response) {
      alert(`해당 게시글이 신고되었습니다.`);
    }
  };

  const handleDeleteSubmit = async () => {
    const response = await DeletePost(post.id, userInfo.token); // Call the API component
    if (response) {
      setAlertModalOpen(false);
      alert(`해당 게시글이 삭제되었습니다.`);
      const currentURL = window.location.pathname;
      if (currentURL.startsWith('/post')) {
        navigate(-1); // 이전 페이지로 이동
      } else {
        setPostUpdated(true); // 새로고침(상태변경으로 바꿀 예정)
      }
    }
  };

  return (
    <PostProfileWrap>
      <button onClick={handlePostClick}>
        <PostProfileImgWrap>
          <img src={post.author.image} alt='프로필 이미지' />
        </PostProfileImgWrap>
        <PostProfileInfo>
          <div>
            <p>{post.author.username}</p>
          </div>
          <p>{post.author.accountname}</p>
        </PostProfileInfo>
      </button>
      <MoreButton onClick={handleClick} />
      {isModalOpen &&
        (post.author.accountname === userInfo.accountname ? (
          <PostModal
            post={post}
            setModalOpen={setModalOpen}
            setAlertModalOpen={setAlertModalOpen}
          />
        ) : (
          <ReportModal
            onClick={handleReportSubmit}
            setModalOpen={setModalOpen}
          />
        ))}
      {alertModalOpen && (
        <ModalAlert
          setAlertModalOpen={setAlertModalOpen}
          onClick={handleDeleteSubmit}
        />
      )}
    </PostProfileWrap>
  );
}

const PostProfileWrap = styled.div`
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    display: flex;
    gap: 12px;
    align-items: center;
  }
`;

const PostProfileImgWrap = styled.div`
  width: 42px;
  height: 42px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const PostProfileInfo = styled.div`
  div {
    margin-bottom: 6px;
  }

  div + p {
    font-size: var(--font-sm);
    color: var(--sub-font-color);
  }
`;
