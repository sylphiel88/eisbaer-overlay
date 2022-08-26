import { NextApiRequest, NextApiResponse } from "next";
import querystring from "query-string";


const getAccessToken = async (refresh_token: string) => {
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  });
  return response.json()
};

export const getNowPlaying = async (refresh_token: string) => {
  
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    var refresh_token = req.body["refresh_token"];
    if (refresh_token !== undefined && refresh_token!=="") {
      const response = await getNowPlaying(req.body.refresh_token);

      if (response.status === 204 || response.status === 400) {
        return res.status(200).json({ isPlaying: false });
      }
      var song = await response.json();
      res.status(200).json(song);
    } else {
      if(refresh_token===""){
        res.status(200).json({
          noRefreshToken:"true"
        })
      } else {
      res.status(400).json({
        error: "something happend",
      });}
    }
  }
}
