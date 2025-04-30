import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiConfig from '@/apiConfig';
import { File } from '@/types';
import Styled from 'styled-components';
import CardComponent from '@/components/common/Card';

const FileDetails = Styled.div`
  margin: 20px;
`

const FileDetail = Styled.div`
  margin: 10px 0;
`

const FilePage = () => {
  const router = useRouter();
  const { user_id, folder_id, file_id } = router.query;
  const [file, setFile] = useState<File | null>(null);
  const host = "http://roketora.local/storage/posts/";

  useEffect(() => {
    const fetchFile = async () => {
      try {
        if (user_id && folder_id && file_id) {
          const response = await fetch(`${apiConfig.baseUrl}/admins/users/${user_id}/posts/folder/${folder_id}/file/${file_id}`);
          const data = await response.json();
          setFile(data);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, [user_id, folder_id, file_id]);

  if (!file) {
    return null;
  }

  return (
    <CardComponent>
      <h1>File Details</h1>
      {/* <h3>メールアドレス {user.}</h3> */}
      <FileDetails>
        <FileDetail>
          <h2>ファイルID: {file.file_id}</h2>
          <p>撮影日時 {file.shooting_datetime}</p>
          {/* <p>撮影地点 {file}</p> */}
          <p>GPS {parseFloat(file.shooting_place_lat) + ',  ' + parseFloat(file.shooting_place_long)}</p>
          <p>撮影端末UUID {file.device_uuid}</p>
          <p></p>
          <img src={`${host}${folder_id}/${file_id}`} alt="" />
        </FileDetail>
        <FileDetail>
          <p>File ID: {file.file_id}</p>
        </FileDetail>
        <FileDetail>
        </FileDetail>
      </FileDetails>
    </CardComponent>
  );
};

export default FilePage;
