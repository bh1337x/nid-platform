import type { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import { NidData, NidError, NidErrorCode } from "../../lib/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<NidData | NidError>
) {
  if (req.method !== "POST")
    return res.status(405).json({
      error: "Invalid Request!",
      code: NidErrorCode.REQUEST_INVALID,
    });
  const { nid, dob } = req.body;
  if (!nid) {
    return res.status(400).json({
      error: "NID Number is empty!",
      code: NidErrorCode.NID_EMPTY,
    });
  }
  if (!dob) {
    return res.status(400).json({
      error: "Date Of Birth is empty!",
      code: NidErrorCode.DOB_EMPTY,
    });
  }
  if (!(nid.length === 10)) {
    if (!(nid.length === 17)) {
      return res.status(400).json({
        error: "NID Number is invalid!",
        code: NidErrorCode.NID_INVALID,
      });
    }
  }
  if (!nid.match(new RegExp(/^[0-9]*$/))) {
    return res.status(400).json({
      error: "NID Number is invalid!",
      code: NidErrorCode.NID_INVALID,
    });
  }
  if (
    !dob.match(new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/))
  ) {
    return res.status(400).json({
      error: "Date Of Birth is invalid!",
      code: NidErrorCode.DOB_INVALID,
    });
  }

  fetch("https://ldtax.gov.bd/citizen/nidCheck/", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      pragma: "no-cache",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrer: "https://ldtax.gov.bd/citizen/register",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `nid=${nid}&dob=${dob}`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data: any) => {
      if (data.success === "true") {
        const $ = cheerio.load(data.data);
        const trs = $("tr");
        const nidData: NidData = {
          name_of_national: (trs[0].children[1] as any).children[0].data,
          name_of_father: (trs[1].children[1] as any).children[0].data,
          name_of_mother: (trs[2].children[1] as any).children[0].data,
          date_of_birth: (trs[3].children[1] as any).children[0].data,
          image_of_national: (trs[4].children[1] as any).children[1].attribs
            .src,
        };
        res.status(200).json(nidData);
      } else {
        res.status(400).json({
          error: "NID Number or Date Of Birth is invalid!",
          code: NidErrorCode.INPUT_INVALID,
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "Error fetching nid info!",
        code: NidErrorCode.INTERNAL_SERVER_ERROR,
      });
    });
}
