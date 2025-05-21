import React, { useState, useEffect } from 'react';
import { TwitterShareButton, FacebookShareButton, WhatsappShareButton, InstapaperShareButton } from 'react-share';
import { Icon } from '@iconify/react';
import { useGetChatHistoryQuery, useChatWithBuddyMutation } from '../redux-tookit/services/authApi';
import { useDispatch, useSelector } from "react-redux";
import AWS from "aws-sdk";
import { useEffectOnce } from 'react-use';
import { toast } from "react-toastify";

const Share = ({ isOpen, closeShareModal, url, message, image, imageUrl, description }) => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const userinfo = useSelector((state) => state?.auth?.user);
  const [uploadedMedia, setUploadedMedia] = useState([]); // Store uploaded media
  useEffect(() => {
    handleUpload(image)
  }, [image])
  useEffect(() => {
    if (imageUrl) {
      setUploadedMedia(imageUrl)
    }
  }, [imageUrl])

  const [chatWithUser, { data: chatBuddy }] = useChatWithBuddyMutation();
  const { data: chatData, isLoading } = useGetChatHistoryQuery({ id: userinfo?._id || null });

  const chatHistory = userinfo?._id ? chatData : [];

  const filteredChatUsers = chatHistory?.map(chat => ({
    ...chat,
    users: chat.users.filter(user => user._id !== userinfo._id),
  }));

  useEffect(() => {
    if (!isLoading && chatData) {
      setShowChatModal(false);
    }
  }, [isLoading, chatData]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const handleUpload = async (e) => {
    const base64Data = e; // Assume 'e' is the base64 string of the image.

    // Remove the base64 prefix (if it exists) - data:image/png;base64,
    const cleanBase64Data = base64Data?.replace(/^data:image\/\w+;base64,/, '');

    // Convert base64 string to a Buffer
    const buffer = Buffer.from(cleanBase64Data, 'base64');

    // Check if the base64 data represents a valid image type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const mimeType = base64Data.split(';')[0].split('/')[1]; // Extract MIME type

    if (!allowedTypes.includes(`image/${mimeType}`)) {
      // alert("Please upload PNG, JPG, or JPEG files only");
      return;
    }

    // Configure AWS S3 with your credentials
    try {
      AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      });

      const s3 = new AWS.S3();

      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: `assets/captured_image_${Date.now()}.png`, // Example of unique naming
        Body: buffer,
        ContentType: `image/${mimeType}`,
        ACL: 'public-read', // Optional, depending on your use case
      };

      const uploadResult = await s3.upload(params).promise();

      // Handle the uploaded media
      const uploadedMedia = [{
        mediaUrl: uploadResult.Location,
        mediaType: "image", // Since we are uploading an image
      }];

      // Do something with uploadedMedia (e.g., set it to state)
      setUploadedMedia(uploadedMedia);
      // Optionally show a success message
      // alert("File uploaded successfully!");

    } catch (error) {
      console.error("Error uploading file:", error);
      // alert("Error uploading file. Please try again later.");
    }
  };


  const handleChatBuddiesShare = async () => {
    try {
      let content = uploadedMedia[0]?.mediaUrl ||  image
      selectedChats.map(async (chatId) => {
        const value = {
          chat: chatId,
          content: `${message} \n ${content} \n ${'Link :- ' + url}`,
          sender: userinfo._id,
        };
    
        const result = await chatWithUser(value).unwrap();
        if(result.success){
          toast.success(result?.message);
          setShowChatModal(false)
        }
      })
    } catch (error) {
      console.error('Error sharing with chat buddies', error);
    }
  };

  const handleSelectChatBuddy = (chatId) => {
    setSelectedChats((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]
    );
  };


  const shareIcons = [
    {
      icon: <Icon icon="basil:chat-solid" color="orange" width="20" />,
      name: 'Chat Buddies',
      action: () => setShowChatModal(true),
    },

  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4">
        <button onClick={closeShareModal} className="absolute top-2 right-2 text-xl">
          ✕
        </button>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Share this article</h2>
        <p>If you like this article, share it with your friends.</p>

        {/* Share Icons */}


        {/* Social Share Buttons */}
        <div className="flex justify-around mt-4 g-4">
          <button

            onClick={() => setShowChatModal(true)}
            className="flex flex-col items-center"
          >
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <Icon icon="basil:chat-solid" color="orange" width="20" />
            </div>
            {/* <span className="mt-1 text-xs sm:text-sm">Chat Buddie</span> */}
          </button>
          <div className='flex flex-col'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-col'>
              <TwitterShareButton
                url={url}
                title={message}
                via="YourTwitterHandle"
              >
                <Icon icon="devicon:twitter" color="black" width="20" />
              </TwitterShareButton>
            </div>
            {/* <span className="mt-1 text-xs sm:text-sm">Twitter</span> */}
          </div>

          <div className='flex flex-col'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-col'>
              <FacebookShareButton url={url} quote={message}>
                <Icon icon="ri:facebook-fill" color="blue" width="25" />
              </FacebookShareButton>
            </div>
            {/* <span className="mt-1 text-xs sm:text-sm">Facebook</span> */}
          </div>

          <div className='flex flex-col'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-col'>
              <WhatsappShareButton url={url}>
                <Icon icon="logos:whatsapp-icon" width="25" />
              </WhatsappShareButton>
            </div>
            {/* <span className="mt-1 text-xs sm:text-sm">Whatsapp</span> */}
          </div>

          <div className='flex flex-col'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-col'>
              <InstapaperShareButton url={url} title={message}>
                <Icon icon="skill-icons:instagram" width="25" />
              </InstapaperShareButton>
            </div>
            {/* <span className="mt-1 text-xs sm:text-sm">Instagram</span> */}
          </div>
        </div>

        {/* Share URL */}
        <div className="relative mt-4 w-full">
          <input
            type="text"
            value={url}
            readOnly
            className="w-full p-2 pr-10 border rounded-md"
          />
          <button
            className="absolute inset-y-0 right-2 flex items-center text-blue-500"
            onClick={handleCopyLink}
          >
            <Icon icon="uil:copy" width="20" />
          </button>
        </div>
      </div>

      {/* Chat Buddies Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-full max-w-md mx-4 h-[80vh]">
            <div className='flex flex-row mb-4 items-center gap-4 '>
              
            <Icon icon="material-symbols:arrow-back-ios-new-rounded" className='cursor-pointer' width="20" onClick={() => setShowChatModal(false)} />
            <h2 className="text-lg sm:text-xl font-semibold ">Select Chat Buddies</h2>
            </div>

            {/* Make the chat list scrollable with a fixed height */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {filteredChatUsers?.map((chat, chatIndex) => (
                chat.is_group ? (
                  <div key={chatIndex} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 gap-2">
                      {chat.group_profile ? (
                        <img
                          src={chat.group_profile}
                          alt={chat.chatname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            {chat.chatname?.substring(0, 1).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-lg">{chat.chatname}</span>
                    </div>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectChatBuddy(chat._id)}
                      checked={selectedChats.includes(chat._id)}
                      className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded-lg "
                    />
                    
                  </div>
                ) : (
                  chat.users.map((user, userIndex) => (
                    <div key={`${chatIndex}-${userIndex}`} className="flex items-center justify-between space-x-4">
                      <div className="flex items-center gap-2">
                        {user.profileImg ? (
                          <img
                            src={user.profileImg}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">
                              {user.username?.substring(0, 1).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-lg">{user.username}</span>
                      </div>
                      <input
                        type="checkbox"
                        onChange={() => handleSelectChatBuddy(chat._id)}
                        checked={selectedChats.includes(chat._id)}
                        className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded-lg "
                      />
                    </div>
                  ))
                )
              ))}
            </div>

            {/* Share Button */}
           

            {/* Close Button */}
            <div className="mt-4 flex justify-end absolute bottom-5 right-4 ">
              <button
                onClick={handleChatBuddiesShare}
                className="bg-secondary text-white py-2 px-4 rounded-md"
                disabled={selectedChats.length === 0}
              >
                Share
              </button>
            </div>
          </div>
          
        </div>
      )}

    </div>
  );
};

export default Share;
