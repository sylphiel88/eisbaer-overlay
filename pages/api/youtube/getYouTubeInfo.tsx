import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    const yt_api_key = process.env.YOUTUBE_API_KEY;
    const yt_api_url = "https://www.googleapis.com/youtube/v3/videos";
    const vid_id = req.query["id"];
    const result = await fetch(`${yt_api_url}?part=snippet&id=${vid_id}&key=${yt_api_key}`)
    const data = await result.json();
    res.status(200).json(data)
  }