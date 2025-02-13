import React, { useEffect, useState } from 'react'
// component imports
import HomeLayout from '../../components/HomeLayout'
//libe imports
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
// thunk imports
import { cancelSubscription } from '../../../Redux/Slices/PaymentsSlice';
import { getUserData, userUpdate } from '../../../Redux/Slices/Authslice';

// img imports
import bgImg from '../../assets/bg img.jpeg'
import { CiEdit } from 'react-icons/ci';
import { AiOutlineArrowLeft } from 'react-icons/ai';
function Profile() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    let userData = useSelector(state => state?.authstate?.data)
    console.log(userData);

    const handleCancelSubscription = async () => {
        toast.loading('Initiating cancellation')
        await dispatch(cancelSubscription(userData._id))

        const response = await dispatch(getUserData(userData._id))
        console.log(response);

        toast.dismiss()
        toast.success('subscription cancelled successfully')
        if (response?.pyaload?.success) {
            await dispatch(getUserData(userData._id))
          window.location.reload()
        }

    }

    const load = async () => {
        console.log('logged');

        const res = await dispatch(getUserData(userData._id));
        console.log(res.pyaload);

    }


    // edit course Modal data


 let data = useSelector(state => state?.authstate?.data);
    const [editing, setEditing] = useState(false)
    const [isEdited, setIsEdited] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const openmodal = () => {
        document.getElementById('my_moadl_4').showModal()
    }

    const [userInput, setUserInput] = useState({
        fullName: data?.fullName,
        avatar: data?.avatar?.secureUrl,
        userId: data?._id,
        ImgPreview: ""

    });

    const handleImgUpload = (e) => {

        e.preventDefault();

        const uploadedImg = e.target.files[0];

        const fileReader = new FileReader();
        fileReader.readAsDataURL(uploadedImg);
        fileReader.addEventListener('load', function () {
            setUserInput({
                ...userInput,
                ImgPreview: this.result,
                avatar: uploadedImg
            })
            setIsEdited(true)
        })
    }

    const handleInputChange = (e) => {
        if (editing) {
            const { name, value } = e.target;
            console.log(name, value);

            setUserInput({
                ...userInput,
                [name]: value
            })
            setIsEdited(true)
        }
    }

    console.log(userInput);
    

    const onFormSubmit = async (e) => {
        e.preventDefault();

        if ((userInput.fullName && userInput.fullName.length < 5)) {
            toast.error('name cannot be of less than 5 characters')
            return
        }
        const formData = new FormData()
        formData.append("fullName", userInput.fullName)
        formData.append("avatar", userInput.avatar)

        const response = await dispatch(userUpdate([userInput.userId, formData]));
        console.log(response);
        

        if (response?.payload?.success) {
            navigate('/user/profile')

        }

        if (response?.payload?.success) {
            console.log('state updated successfully');
        }

    }

    useEffect(() => {
        load()
    }, [])

    return (
        <HomeLayout>
            <div className=' min-h-[90vh] bgImg_profile flex flex-col bg-white justify-center items-center'>
                

                <div className='h-[50vh]  px-7 w-full '>
                    <div className=' flex my-auto gap-4  bg-gray-200 rounded-lg text-white h-full w-full lg:w-7/12 mx-auto shadow-[0_0_7px_gray] flex-col lg:flex-row justify-between items-center'>
                        <div className='w-full lg:w-[50%] lg:h-4/12 lg:h-full flex justify-center lg:gap-12  flex-col items-center  bg-blue-200'>
                           <div className=' h-full w-full flex justify-center flex-col gap-1 my-2  lg:gap-6 lg:mb-4'>
                           <img src={userData?.avatar?.secureUrl}
                                className=' rounded-full w-28 lg:w-36 mx-auto'
                                alt="" />
                            <div className='  flex flex-col justify-center w-full items-center'>
                            <h3 className=' text-center capitalize text-xl border-1 text-black font-semibold tracking-wide'>
                                <u> {userData?.fullName}

                                </u>
                            </h3>
                            <p className=' text-black text-sm'>({userData.role})</p>
                            </div>

                           </div>
                        </div>
                        <div className=' w-full lg:w-[70%]  h-full flex flex-col justify-evenly '>
                            <div className=' flex flex-col w-full px-4'>
                                <label htmlFor="" className=' text-black font-semibold text-lg'>Email :</label>
                                <input type="text" value={userData.email} className=' 
                                bg-transparent border-black border-2 text-sm rounded px-2 py-2 text-black' onChange={()=>{}} />
                            </div>
                            <div className=' flex flex-col w-full px-4'>
                                <label htmlFor="" className=' text-black font-semibold text-lg'>Role :</label>
                                <input type="text" value={userData.role} onChange={()=>{}} className=' bg-transparent border-black border-2 text-sm rounded px-2 py-2 text-black' />
                            </div>

                            <div className=' flex items-center px-4 justify-between gap-2'>
                                <Link to="/changepassword"
                                    className=" bg-yellow-600 w-1/2 py-3 lg:py-2 px-2 text-white text-sm lg:text-lg font-bold hover:bg-yellow-500 transition-all ease-in-out duration-200 hover:text-black"
                                >
                                    <button>Change Password</button>
                                </Link>
                                <div to="/user/editprofile"
                                    className=" bg-yellow-600 w-1/2 py-3 lg:py-2 px-2 text-white text-sm lg:text-lg lg:font-bold font-semibold hover:bg-yellow-500 transition-all ease-in-out duration-300 text-center hover:text-black"
                                >
                                    <button
                                    onClick={() => document.getElementById('my_modal_4').showModal()}
                                    >Edit profile</button>
                                </div>

                            </div>
                            <div className=' px-4'>
                                {userData?.subscription.status === "Active" ? (
                                    <button onClick={() => handleCancelSubscription()} className=' bg-red-600 w-full font-bold py-2 text-xl hover:bg-red-400 transition-all ease-in-out duration-300'>Cancel subscription</button>
                                ) : null}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

           
                  
                    <dialog id="my_modal_4" className="modal px-5 lg:px-0 w-full bgImg_profile ">
                                        <form
                                        onSubmit={onFormSubmit}
                                        noValidate
                                        className=' flex flex-col lg:flex-row items-center content-center  rounded-sm h-[25rem] lg:h-[22rem] shadow-[0_0_10px_black] lg:w-7/12 w-full '
                                    >
                                        {/* <h1 className=' text-2xl font-semibold text-center text-white py-1'>Edit Profile</h1> */}
                    
                                        <div className=' w-full lg:w-[40%] bg-blue-200 h-full flex flex-col lg:gap-5 gap-0 items-center justify-center py-2 lg:py-2'>
                                        <div className=' relative'>
                                            <label htmlFor="avatar" className=' cursor-pointer '>
                                                {userInput.ImgPreview ? (<img src={userInput?.ImgPreview} alt="" className='  w-32 h-32 rounded-full m-auto' />) : (
                                                    <img src={userInput?.avatar} alt="" className='  lg:w-44 lg:h-44 h-24 w-24 rounded-full m-auto' />
                    
                                                )}
                                                <CiEdit className=' absolute left-24 bg-black bottom-0 text-3xl hover:bg-black  rounded-full  transition-all ease-in-out duration-300' />
                    
                                            </label>
                                            <input accept=".jpg, .jpeg, .svg, .png" type="file" hidden id='avatar' onChange={handleImgUpload} />
                                        </div>
                                          <div className=' flex flex-col justify-center items-center w-full'>
                                          <h2 className=' text-black capitalize text-xl font-semibold'>{userInput.fullName}</h2>
                                          <p className=' text-black'>({data.role})</p>
                                          </div>
                                        </div>
                                       
                                       <div className=' w-full lg:w-[60%] bg-white flex flex-col justify-center py-9 items-start h-full px-14 space-y-7'>
                                       <div className=' w-full flex justify-start gap-2 flex-col items-start px-auto'>
                                            <label htmlFor="title" className=' text-xl lg:text-2xl font-semibold text-black'>Full name :
                                            </label>
                    
                    
                                            {editing ? (<input type="text" value={userInput.fullName} name='fullName' onChange={handleInputChange} className=' w-full border-black border-2 px-4 rounded bg-transparent text-xl text-black font-semibold capitalize py-1' />) : (
                                                <p className=' w-full rounded bg-transparent border-2 px-2 border-black text-sm lg:text-xl  text-black font-semibold capitalize relative '>{userInput.fullName}
                                                    {!editing ? (<CiEdit onClick={() => setEditing(true)} className=' absolute left-80 bottom-0.5 border border-black text-2xl transition-all ease-in-out duration-300 rounded-full' />) : null}
                    
                                                </p>
                                            )}
                    
                                        </div>
                    
                                        <div type="Submit" className='w-full'>
                                            <button disabled={!editing || !isEdited} className=' w-full rounded py-1 bg-yellow-600 text-white text-xl lg:text-2xl font-semibold hover:bg-yellow-500 hover:text-black transition-all ease-in-out duration-300 '>Save Changes</button>
                                        </div>
                    
                                        <div className=' relative flex items-center w-full justify-start'>
                    
                                            <div 
                                            onClick={() => window.location.reload()}
                                            className=' flex items-center w-full justify-start gap-2 '>
                                                <AiOutlineArrowLeft className='  cursor-pointer text-3xl hover:bg-black transition-all ease-in-out duration-300 rounded-full' />
                                                <p className='text-red-400 text-xl font-semibold hover:underline transition-all ease-in-out duration-300 cursor-pointer'>Go back to profile</p>
                                            </div>
                                            <div className="modal-action  px-4 absolute bottom-0 right-5 bg-yellow-400 rounded-lg ">
                                               
                                            </div>
                                        </div>
                                       </div>
                    
                                            
                                        </form>
                                    </dialog>
                
        

        </HomeLayout>
    )
}

export default Profile
