import React, { use, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle, Share2, BarChart2 } from "lucide-react";
import { CircleAlert } from 'lucide-react';
import ShareComponent from './ShareComponent'
import { GenericCheckboxGroup } from '../../Generic_Components/GenericCheckboxGroup';
import { Input } from "@/components/ui/input"
import PollComment from './PollComment';
import { useUser } from '@clerk/clerk-react';




const SharePoll = () => {

  const { isSignedIn, user } = useUser();
  console.log(isSignedIn, user)

  const [PollData, setPollData] = useState();

  // State to manage selected items in  single Selection
  const [selectedOption, setSelectedOption] = useState("");
  const [PostData, setPostData] = useState("")

  const [open, setOpen] = useState(false);


  // State to manage selected items in  Multiple Selection
  const [selectedItems, setSelectedItems] = useState([]);

  // State for Participant Name
  const [participantName, setparticipantName] = useState(undefined);

  useEffect(() => {
    if (PostData === "Vote Submitted Successfully!") {
      setOpen(true);
    }
  }, [PostData]);


  const { poll_id } = useParams()

  const getPollData = async () => {

    try {
      const response = await axios.get(`http://localhost:8008/poll/${poll_id}`)
      setPollData(response.data.PollData)
      console.log(response.data.PollData)
    } catch (err) {
      console.log("Error :", err.message)
    }

  }

  const HandleVote = async () => {
    await PostPollVote();
  };

  const PostPollVote = async () => {
    try {
      const PostVote = await axios.post("http://localhost:8008/vote", {
        poll_id: PollData?._id,
        selected_option: PollData?.poll_settings?.allowMultipleSelection
          ? selectedItems // Use selectedItems if multiple selections are allowed
          : [selectedOption], // Use selectedOption if only one selection is allowed
        VotePerIP: PollData?.poll_settings?.oneVotePerIP,
        ParticipantName: participantName
      });

      setPostData(PostVote.data?.error || "Vote Submitted Successfully!"); // Handle missing error field
    } catch (err) {
      console.log("Error:", err.message);
      setPostData("Failed to submit vote");
    }
  };

  const DisableVoteButton = () => {
    const isSelectionEmpty = PollData?.poll_settings?.allowMultipleSelection
      ? selectedItems.length === 0
      : !selectedOption;

    if (PollData?.poll_settings?.requireParticipantName) {
      return !participantName || isSelectionEmpty;
    }

    return isSelectionEmpty;
  };

  useEffect(() => {
    getPollData()
  }, [])

  return (

    <>

      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className=" bg-[#111827] text-white rounded-lg">
            <DialogHeader>
              <div className="flex flex-col items-center">
                <CheckCircle className="text-green-500 w-10 h-10 mb-2" />
                <DialogTitle className="text-lg font-semibold">Vote Successful</DialogTitle>
                <DialogDescription className="text-sm text-gray-400 text-center">
                  Thank you for participating in this poll. Your vote has been counted.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex justify-between mt-4">
              <Link to={`/poll/${poll_id}/result`}>
                <Button className="bg-[#8E51FF] hover:bg-[#8e51ffbb] flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4" />
                  <span>Results</span>
                </Button>
              </Link>
              {/* <Button variant="outline" className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button> */}
            </div>
          </DialogContent>
        </Dialog>
      </div>


      <div
        className={`bg-[#111827] w-full flex flex-col justify-start items-center ${PollData?.poll_settings?.allowComments ? "h-fit" : "h-screen"
          }`}
      >

        <div className="bg-[#1F2937] max-md:min-w-8/9 md:w-xl p-5 rounded-lg border-t-3 border-[#8E51FF] mt-16">


          <div>
            <h1 className='scroll-m-20 text-xl font-semibold tracking-tight text-white'>{PollData?.poll_details.poll_title}</h1>
            <h1 className='scroll-m-20 text-xs font-extralight tracking-tight text-white'>By {PollData?.Created_by}</h1>
          </div>

          {PollData?.poll_settings.requireParticipantName &&
            (<div className='pt-5'>
              <Label className="text-[#71717B] text-xs pb-1">Participant Name</Label>
              <Input
                type="text"
                placeholder="Name is Required*"
                className='p-3 text-white bg-[#2A3441] border-[#4e5155] text-sm w-2xs'
                value={participantName}
                onChange={(e) => setparticipantName(e.target.value)}
              />
            </div>)
          }



          <div className='my-5'>

            {PollData?.poll_settings.allowMultipleSelection ?

              (<GenericCheckboxGroup CheckboxData={PollData?.poll_details.poll_options} setSelectedItems={setSelectedItems} selectedItems={selectedItems} />)

              : (<RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {PollData?.poll_details.poll_options.map((option, index) => (
                  <div key={option} className="flex items-center space-x-2 my-1">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-white">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>)}

          </div>



          <div className='my-3 bg-[#565758] h-[1px]'></div>

          <div className='flex space-x-5 items-center'>
            <div className=''>

              <Button
                className={`bg-[#8E51FF] hover:bg-[#8e51ffbb] w-fit my-2 ${(PollData?.poll_settings?.allowMultipleSelection ? selectedItems.length > 0 : selectedOption)
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
                  }`}

                disabled={DisableVoteButton()}
                onClick={HandleVote}
              >
                Vote
              </Button>



            </div>

            <div>
              <Link to={`/poll/${poll_id}/result`}>
                <Button className="bg-[#8E51FF] hover:bg-[#8e51ffbb] cursor-pointer w-fit my-2">
                  Show Result <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>

          {
            PostData === "You have already voted!" ? (
              <div className='bg-[#362937] p-3 mt-2 rounded-md' >
                <Label className="text-white text-xs pb-1"><CircleAlert width={18} />{PostData}</Label>
              </div>) : (null)
          }

        </div>


        {/* Comment Component */}
        {PollData?.poll_settings.allowComments &&
          (<div className=' w-full mt-12'>
            <PollComment pollid={poll_id} />
          </div>)}

      </div >

      {/* <div className="absolute bottom-30 w-full z-50">
        <ShareComponent />
      </div> */}




    </>
  )
}

export default SharePoll