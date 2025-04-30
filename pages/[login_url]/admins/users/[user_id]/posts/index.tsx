import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiConfig from '@/apiConfig';
import { Post } from '@/types';
import Link from 'next/link';
import Styled from 'styled-components';
import CardComponent from '@/components/common/Card';

const FolderLists = Styled.ul`
`
const FolderList = Styled.li`
`
const FileLists = Styled.ul`
  display: flex;
  width: 100%;
`
const FileList = Styled.li`
  width: calc(100% / 8);
  position: relative;
`
const Input = Styled.input`
  position: absolute;
  top: 0;
  right: 0;
  width: 1.25rem;
  height: 1.25rem;
`

const PostsPage = () => {
  const router = useRouter();
  const { user_id } = router.query;
  const [posts, setPosts] = useState<Post[]>([]);
  const host = "http://roketora.local/storage/posts/";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (user_id) {
          const response = await fetch(`/cms/1.0/users/${user_id}/posts`);
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user_id]);

  return (
    <CardComponent>
      <h1>Posts for User {user_id}</h1>
      <FolderLists>
        {posts.map((post) => (
          <FolderList key={post.folder_id}>
            <h2>{post.folder_name}</h2>
            <FileLists>
              {post.files.map((file) => (
                <FileList key={file.id}>
                  <Link href={`/users/${user_id}/posts/${post.folder_id}/${file.file_id}`}>
                    <img src={`${host}${post.folder_id}/${file.file_id}`} alt="" />
                    <Input type="checkbox"></Input>
                  </Link>
                </FileList>
              ))}
            </FileLists>
          </FolderList>
        ))}
      </FolderLists>
    </CardComponent>
  );
};

export default PostsPage;

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import apiConfig from '@/apiConfig';
// import { Post } from '@/types';
// import Link from 'next/link';
// import Styled from 'styled-components';
// import AWS from 'aws-sdk';

// const FolderLists = Styled.ul`
// `
// const FolderList = Styled.li`
// `
// const FileLists = Styled.ul`
//   display: flex;
//   width: 100%;
// `
// const FileList = Styled.li`
//   width: calc(100% / 8);
//   position: relative;
// `
// const Input = Styled.input`
//   position: absolute;
//   top: 0;
//   right: 0;
//   width: 1.25rem;
//   height: 1.25rem;
// `

// const PostsPage = () => {
//   const router = useRouter();
//   const { user_id } = router.query;
//   const [posts, setPosts] = useState<Post[]>([]);
//   const host = "http://roketora.local/storage/posts/";

//   AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'us-east-1',
//   });

//   const rekognition = new AWS.Rekognition();
//     useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         if (user_id) {
//           const response = await fetch(`${apiConfig.baseUrl}/admins/users/${user_id}/posts`);
//           const data = await response.json();

//           const postsWithContentCheck = await Promise.all(data.map(async (post:any) => {
//             const filesWithContentCheck = await Promise.all(post.files.map(async (file:any) => {
//               // console.log(file);
//               try {
//                 // const imageData = await fetch(`${host}${post.folder_id}/${file.file_id}`, { mode: 'no-cors' });
//                 const imageData = await fetch(`/test.jpg`);
//                 // console.log('aaa',imageData);
//                 const imageBuffer = await imageData.arrayBuffer();
//                 const rekognitionParams = {
//                   Image: {
//                     Bytes: new Uint8Array(imageBuffer),
//                   },
//                 };
//                 // console.log("bbb",rekognitionParams);
//                 const result = await rekognition.detectModerationLabels(rekognitionParams).promise();
//                 console.log("ccc",result);
//                 if (result.ModerationLabels && result.ModerationLabels.length > 0) {
//                   console.warn('Inappropriate content detected:', result.ModerationLabels);
//                   return { ...file, isSafe: false };
//                 } else {
//                   return { ...file, isSafe: true };
//                 }
//               } catch (error) {
//                 console.error('Error checking content:', error);
//                 return { ...file, isSafe: false };
//               }
//             }));
//             return { ...post, files: filesWithContentCheck };
//           }));

//           setPosts(postsWithContentCheck);
//         }
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };

//     fetchPosts();
//   }, [user_id]);

//   return (
//     <div>
//       <h1>Posts for User {user_id}</h1>
//       <FolderLists>
//         {posts.map((post) => (
//           <FolderList key={post.folder_id}>
//             <h2>{post.folder_name}</h2>
//             <FileLists>
//               {post.files.map((file) => (
//                 <FileList key={file.id}>
//                   <Link href={`/users/${user_id}/posts/${post.folder_id}/${file.file_id}`}>
//                     <img src={`${host}${post.folder_id}/${file.file_id}`} alt="" />
//                     <Input type="checkbox"></Input>
//                     {!file.isSafe && <p>不適切な画像</p>}
//                   </Link>
//                 </FileList>
//               ))}
//             </FileLists>
//           </FolderList>
//         ))}
//       </FolderLists>
//     </div>
//   );
// };

// export default PostsPage;


// // Error checking content: ValidationException: 1 validation error detected: Value 'java.nio.HeapByteBuffer[pos=0 lim=0 cap=0]' at 'image.bytes' failed to satisfy constraint: Member must have length greater than or equal to 1 at Request.extractError
