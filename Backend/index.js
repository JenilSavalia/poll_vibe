import { PollResult } from "./Model/PollResult.js"
import { PollDetail } from "./Model/PollDetail.js"
import { User } from "./Model/User.js"
import express from 'express'
import mongoose from "mongoose"
import cors from 'cors'
import dotenv from 'dotenv';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';


dotenv.config();

const app = express()
app.use(cors())

const PORT = process.env.PORT || 4000;
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "PollVibe"
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

connectDB();



// Webhook endpoint with bodyParser.raw() middleware
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const payload = req.body.toString(); // Get raw payload as string
    const headers = req.headers; // Get headers for signature verification

    // Initialize Webhook with your Clerk webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    try {
        // Verify the webhook payload
        const evt = wh.verify(payload, headers);

        // Handle the event
        switch (evt.type) {
            case 'user.created':
                console.log('User created:', evt.data);
                // Create a new user in MongoDB
                const newUser = new User({
                    clerkUserId: evt.data.id,
                    firstName: evt.data.first_name,
                    lastName: evt.data.last_name,
                    email: evt.data.email_addresses[0].email_address,
                    profileImage: evt.data.profile_image_url,
                });
                await newUser.save();
                console.log('User created in MongoDB:', newUser);
                break;

            case 'user.updated':
                console.log('User updated:', evt.data);

                // Update an existing user in MongoDB
                await User.findOneAndUpdate(
                    { clerkUserId: evt.data.id },
                    {
                        firstName: evt.data.first_name,
                        lastName: evt.data.last_name,
                        email: evt.data.email_addresses[0].email_address,
                        profileImage: evt.data.profile_image_url,
                    },
                    { new: true } // Return the updated document
                );
                console.log('User updated in MongoDB');
                break;

            default:
                console.log('Unhandled event type:', evt.type);
        }

        // Respond with success
        res.status(200).json({ success: true });
    } catch (err) {
        // Handle errors (e.g., invalid signature, database errors)
        console.error('Webhook verification failed:', err);
        res.status(400).json({ success: false, error: err.message });
    }
});


app.use(express.json());

const clerkPubKey = process.env.CLERK_PUBLISHABLE_KEY;

// Middleware to verify authentication
const requireAuth = ClerkExpressRequireAuth();

app.get('/', (req, res) => {
    res.send('Welcome to the public route!');
});

app.get('/protected', requireAuth, (req, res) => {
    // req.auth contains the authenticated user's details
    const user = req.auth;
    res.json({ message: 'You are authenticated!', user });
});


// Create a new poll
app.post('/poll', async (req, res) => {



    const { poll_details, ClerkID, endDate, poll_settings } = req.body;

    if (!poll_details || !poll_details.poll_options || !endDate || !poll_settings) {
        return res.status(400).json({ error: 'poll_details and ClerkID are required, and poll_details must contain array of poll_options' });
    }

    try {

        const FindUserByClerkID = await User.find({ clerkUserId: ClerkID })

        const Created_by = FindUserByClerkID[0]._id
        // console.log(FindUserByClerkID[0]._id)

        const NewPoll = new PollDetail({ endDate, poll_details, poll_settings, Created_by });
        await NewPoll.save();


        await User.updateOne(
            { _id: NewPoll.Created_by },
            { $addToSet: { UserPoll: NewPoll._id } }
        )


        // Initialize selected_options with poll_options, setting each option's count to 0
        const initialOptions = NewPoll.poll_details.poll_options.reduce((acc, option) => {
            acc[option] = 0;
            return acc;
        }, {});



        await PollResult.create({
            poll_id: NewPoll._id,
            selected_options: initialOptions
        })


        res.json({ PollId: NewPoll._id })
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }

})


// Get poll informtion
app.get('/poll/:poll_id', async (req, res) => {

    const { poll_id } = req.params;
    const user = req.auth;


    try {
        const findPoll = await PollDetail.findById(poll_id)

        if (!findPoll) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        const now = new Date();
        const endDate = new Date(findPoll.endDate);
        console.log(new Date().toISOString());


        if (now > endDate) {
            // If endDate has passed, update poll_status to false
            findPoll.poll_status = false;
            await findPoll.save();

            return res.status(400).json({ error: 'This poll has ended.' });
        }

        res.json({ PollData: findPoll, user })
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }

})


// Get All Polls for a User
app.get('/user/polls', requireAuth, async (req, res) => {

    const user = req.auth;

    // res.json({ ID: user.userId })

    try {
        const findPoll = await User.find({ clerkUserId: user.userId }).populate("UserPoll")

        if (!findPoll) {
            return res.status(404).json({ error: 'Polls not found' });
        }

        // const now = new Date();
        // const endDate = new Date(findPoll.endDate);
        // console.log(new Date().toISOString());


        // if (now > endDate) {
        //     // If endDate has passed, update poll_status to false
        //     findPoll.poll_status = false;
        //     await findPoll.save();

        //     return res.status(400).json({ error: 'This poll has ended.' });
        // }

        res.json({ PollData: findPoll, user })
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }

})




// Post the vote for multiple Choice Question
app.post('/vote', async (req, res) => {

    const { poll_id, selected_option, VotePerIP, ParticipantName } = req.body;
    const voted_ip = req.ip;



    if (!poll_id || !selected_option) {
        return res.status(400).json({ error: 'poll_id and selected_option are required' });
    }

    // Convert VotePerIP to a boolean
    // const allowMultipleVotes = VotePerIP === "false" ? false : true;
    const allowMultipleVotes = VotePerIP;


    try {

        let result = await PollResult.findOne({ poll_id });

        if (!result) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        // Use atomic operations to update the poll result
        let updatedResult;

        if (!allowMultipleVotes) {
            // If multiple votes are allowed, skip the IP check and increment the vote count
            updatedResult = await PollResult.findOneAndUpdate(
                { poll_id }, // No IP check
                {
                    $inc: selected_option.reduce((acc, option) => {
                        acc[`selected_options.${option}`] = 1; // Increment each selected option
                        return acc;
                    }, {}), // Initialize accumulator as an empty object
                    $push: {
                        voted_ips: voted_ip, // Add the voter's IP
                        participants: { // Add participant name if provided
                            name: ParticipantName,
                            selectedOptions: selected_option, // Store array of selected options
                        },
                    },
                },
                { new: true } // Return the updated document
            );
        } else {
            // If multiple votes are not allowed, enforce one vote per IP
            updatedResult = await PollResult.findOneAndUpdate(
                { poll_id, voted_ips: { $ne: voted_ip } }, // Ensure the IP hasn't voted
                {
                    $inc: selected_option.reduce((acc, option) => {
                        acc[`selected_options.${option}`] = 1; // Increment each selected option
                        return acc;
                    }, {}), // Initialize accumulator as an empty object
                    $push: {
                        voted_ips: voted_ip, // Add the voter's IP
                        participants: { // Add participant name if provided
                            name: ParticipantName,
                            selectedOptions: selected_option, // Store array of selected options
                        },
                    },
                },
                { new: true } // Return the updated document
            );

            // If no document was updated, it means the IP has already voted
            if (!updatedResult) {
                return res.json({ error: 'You have already voted!' });
            }
        }


        // Return the updated poll result
        return res.json({ PollResult: updatedResult });
    } catch (err) {
        console.error('Error in /vote:', err);
        return res.status(500).json({ error: 'An error occurred while processing your vote' });
    }
});



// Post Comment
app.post('/vote/comment', async (req, res) => {

    const { poll_id, Comment } = req.body;

    if (!poll_id) {
        return res.status(400).json({ error: 'poll_id and selected_option are required' });
    }


    try {
        let PostComment = await PollResult.findOne({ poll_id });

        PostComment.comments.push({
            name: Comment.name,
            comment: Comment.commentMatter
        })

        await PostComment.save()

        console.log("Comment Saved", PostComment)
        return res.json({ Status: "Comment Saved" })

    } catch (err) {
        console.error('Error in posting Comment:', err);
        return res.status(500).json({ error: 'An error occurred while processing your Comment' });
    }

})


// Get Comments by Poll Id
app.get('/vote/comment/:poll_id', async (req, res) => {

    const { poll_id } = req.params;

    if (!poll_id) {
        return res.status(400).json({ error: 'poll_id not provided' });
    }


    try {
        let getComment = await PollResult.findOne({ poll_id });

        return res.status(200).json({
            Status: "Success",
            Comments: getComment.comments
        })

    } catch (err) {
        console.error('Error in Getting Comment:', err);
        return res.status(500).json({ error: 'An error occurred while getting your Comments' });
    }

})






// get Poll Result By poll_id
app.get("/vote/result/:Poll_id", requireAuth, async (req, res) => {
    const { Poll_id } = req.params;

    try {

        const Resposes = await PollResult.findOne({ poll_id: Poll_id })
        if (!Resposes) {
            return res.status(404).json({ Error: "Poll Not Found" })
        }

        return res.status(201).json({ Result: Resposes.selected_options })

    } catch (err) {
        return res.status(500).json({ Error: err.message })
    }

})



app.listen(PORT, () => {
    console.log(`Listning on port ${PORT}`)
})