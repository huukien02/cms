import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiConfig from '@/apiConfig';
import { File } from '@/types';
import Link from 'next/link';
import Styled from 'styled-components';

const FileLists = Styled.ul`
  display: flex;
  width: 100%;
`
const FileList = Styled.li`
  width: calc(100% / 8);
  position: relative;
`

const FolderPage = () => {
  const router = useRouter();
  const { user_id, folder_id } = router.query;
  const [files, setFiles] = useState<File[]>([]);
  const host = "http://roketora.local/storage/posts/";

  useEffect(() => {
    const fetchFilesForFolder = async () => {
      try {
        if (user_id && folder_id) {
          const response = await fetch(`${apiConfig.baseUrl}/admins/users/${user_id}/posts/folder/${folder_id}`);
          const data = await response.json();
          setFiles(data.files);
        }
      } catch (error) {
        console.error('Error fetching files for folder:', error);
      }
    };

    fetchFilesForFolder();
  }, [user_id, folder_id]);

  return (
    <div>
      <h1>Files for Folder ID {folder_id}</h1>
      <FileLists>
        {files.map((file) => (
          <FileList key={file.file_id}>
            <Link href={`/users/${user_id}/posts/${folder_id}/${file.file_id}`}>
              <img src={`${host}${folder_id}/${file.file_id}`} alt="" />
            </Link>
          </FileList>
        ))}
      </FileLists>
    </div>
  );
};

export default FolderPage;
