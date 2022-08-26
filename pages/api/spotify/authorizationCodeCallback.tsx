import { NextApiRequest, NextApiResponse } from "next";
import querystring from "query-string";

const getAccessToken = async (code: string) => {
  const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  const REDIRECT_URI = "http://localhost:3000/api/spotify/authorizationCodeCallback";
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });
  return response.json();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const CODE = req.query.code || null;
  if(CODE!==null){
    const response = await getAccessToken(CODE as string);
    res.status(200).send(response.refresh_token)
  }
}
