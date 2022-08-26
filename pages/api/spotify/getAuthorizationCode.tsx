import { NextApiRequest, NextApiResponse } from "next";
import querystring from "query-string";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SCOPE = "user-read-currently-playing";
  const REDIRECT_URI = "http://localhost:3000/api/spotify/refreshTokenCallback";
  res.setHeader("Access-Control-Allow-Origin","account.spotify.com")
  res.setHeader("withCredentials","true")
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
      })
  );
}