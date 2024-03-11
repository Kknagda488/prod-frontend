export default function zoommailbody(zoomBucket, batchData) {
  const tbody = zoomBucket.map((form) => {
    const timinghead = form?.time_slots?.map((times, index) => {
      return `<td
          style="
  width: 98.5pt;
  border: solid windowtext 1pt;
  border-left: none;
  padding: 0cm 5.4pt 0cm 5.4pt;
  height: 8.65pt;
"
          valign="top"
          width="131"
        >
          <p className="v1v1MsoNormal">
            <strong>
              <span style="mso-fareast-language: EN-IN">
                Day ${index + 1} timings
              </span>
            </strong>
            <span style="mso-fareast-language: EN-IN"></span>
          </p>
        </td>`;
    });
    const timingbody = form?.time_slots?.map((times) => {
      return `<td
          style="
        width: 98.5pt;
        border-top: none;
        border-left: none;
        border-bottom: solid windowtext 1pt;
        border-right: solid windowtext 1pt;
        padding: 0cm 5.4pt 0cm 5.4pt;
        height: 65pt;
      "
          valign="top"
          width="131"
        >
          <p className="v1v1MsoNormal">
            <span style="mso-fareast-language: EN-IN">${times?.time_slot}</span>
          </p>
        </td>`;
    });
    return `
        <tr style="height: 8.65pt">
          <td
            style="
              width: 67.45pt;
              border: solid windowtext 1pt;
              padding: 0cm 5.4pt 0cm 5.4pt;
              height: 8.65pt;
            "
            valign="top"
            width="90"
          >
            <p className="v1v1MsoNormal">
              <strong
                ><span style="mso-fareast-language: EN-IN"
                  >Batch&nbsp;</span
                ></strong
              ><span style="mso-fareast-language: EN-IN"></span>
            </p>
          </td>
          <td
            style="
              width: 92.3pt;
              border: solid windowtext 1pt;
              border-left: none;
              padding: 0cm 5.4pt 0cm 5.4pt;
              height: 8.65pt;
            "
            valign="top"
            width="123"
          >
            <p className="v1v1MsoNormal">
              <strong
                ><span style="mso-fareast-language: EN-IN"
                  >Trainer</span
                ></strong
              ><span style="mso-fareast-language: EN-IN"></span>
            </p>
          </td>
          ${timinghead}
          
          <td
            style="
              width: 380.95pt;
              border: solid windowtext 1pt;
              border-left: none;
              padding: 0cm 5.4pt 0cm 5.4pt;
              height: 8.65pt;
            "
            valign="top"
            width="508"
          >
            <p className="v1v1MsoNormal">
              <strong
                ><span style="mso-fareast-language: EN-IN"
                  >Zoom Links</span
                ></strong
              ><span style="mso-fareast-language: EN-IN"></span>
            </p>
          </td>
        </tr>
        <tr style="height: 65pt">
          <td
            style="
              width: 67.45pt;
              border: solid windowtext 1pt;
              border-top: none;
              padding: 0cm 5.4pt 0cm 5.4pt;
              height: 65pt;
            "
            valign="top"
            width="90"
          >
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN">&nbsp;Batch 1</span>
            </p>
          </td>
          <td
            style="
              width: 92.3pt;
              border-top: none;
              border-left: none;
              border-bottom: solid windowtext 1pt;
              border-right: solid windowtext 1pt;
              padding: 0cm 5.4pt 0cm 5.4pt;
              height: 65pt;
            "
            valign="top"
            width="123"
          >
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                >${batchData.tranineeName}</span
              >
            </p>
          </td>
          ${timingbody}
          
         
          <td
            style="
              width: 380.95pt;
              border-top: none;
              border-left: none;
              border-bottom: solid windowtext 1pt;
              border-right: solid windowtext 1pt;
              padding: 0cm 5.4pt 0cm 5.4pt;
              height: 65pt;
            "
            valign="top"
            width="508"
          >
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                >Topic: ${form.name}</span
              >
            </p>
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                >Time: ${form.start}</span
              >
            </p>
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${form.start}</span
              >
            </p>
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${form.end}</span
              >
            </p>
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                >Join Zoom Meeting</span
              >
            </p>
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                ><a
                  href=${form.url}
                  rel="noreferrer"
                  target="_blank"
                  >${form.url}</a
                ></span
              >
            </p>
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN">&nbsp;</span>
            </p>
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                >Meeting ID: ${form.meetId}</span
              >
            </p>
            <p className="v1v1MsoNormal">
              <span style="mso-fareast-language: EN-IN"
                >Passcode: ${form.passcode}<span style="color: black"></span
              ></span>
            </p>
          </td>
        </tr>
      `;
  });

  let body = `<body style="font-size: 28px;">
    <p
      className="v1v1MsoNormal"
      style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"
    >
      <span style="color: #26282a; mso-fareast-language: EN-IN"
        >We confirm the training program for Kotak on</span
      ><span style="color: black; mso-fareast-language: EN-IN"> </span
      ><span style="color: #26282a; mso-fareast-language: EN-IN"
        >Banking Orientation program. Content </span
      ><span style="mso-fareast-language: EN-IN"
        >has already been shared with you<span style="color: #26282a"
          >. Please find the details below.</span
        ></span
      >
    </p>
    <p
      className="v1v1MsoNormal"
      style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"
    >
      <span
        style="
          background: yellow;
          mso-highlight: yellow;
          mso-fareast-language: EN-IN;
        "
        >Please find enclosed attendance sheet. You will receive automated
        email for Pre, Post and Feedback links. There will be a link for live
        tracking as well. Keep Syncing to get updated data.</span
      ><span style="mso-fareast-language: EN-IN"></span>
    </p>
    <p
      className="v1v1MsoNormal"
      style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"
    >
      <span
        style="
          background: yellow;
          mso-highlight: yellow;
          mso-fareast-language: EN-IN;
        "
        >Please share total no of participants and count of present on Day-1
        and Day-2 while sharing the attendance sheet.</span
      ><span style="mso-fareast-language: EN-IN"></span>
    </p>

    <table
    className="v1v1MsoNormalTable"
    style="border-collapse: collapse"
    border="0"
    cellspacing="0"
    cellpadding="0"
  >
  <tbody>
    ${tbody.join("")}
    </tbody>
  </table>
  <div className="v1v1WordSection1">
<p className="v1v1MsoNormal"><span style="color: black; mso-fareast-language: EN-IN">&nbsp;</span><span style="color: #26282a; mso-fareast-language: EN-IN">&nbsp;</span><span style="mso-fareast-language: EN-IN"></span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><strong><span style="color: #26282a; mso-fareast-language: EN-IN">&nbsp;<span style="background: yellow">Important Instructions to be followed by Trainer</span></span></strong><strong><span style="color: black; background: yellow; mso-fareast-language: EN-IN"> for Virtual Session</span></strong><strong><span style="color: #26282a; background: yellow; mso-fareast-language: EN-IN">:</span></strong></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">A. LOG IN 15 MINS before the program </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">B. INTRODUCE YOURSELF briefly. Keep the video on so that participants can see the trainer </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">C. Keep MIC at about 2 INCHES DISTANCE from mouth. Speak loudly and clearly </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">D. Ensure that you do a FULL SCREEN on your system before you start the Training </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">E. INTRODUCE THE TOPIC </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">F. SET CONTEXT before each session</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">G. Please refer to the CHAT BOX after every 5-10 minutes and address concerns if any </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">H. VIDEO played during the session, should be AUDIBLE and VISIBLE to the participants </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">I. Ask the participants if they have PROPER AUDIO SETTING </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">J. If a participant is SPEAKING his name will get HIGHLIGHTED, identify and address his query </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">K. In between the slides put the VIDEO OPTION ON, interact with the participants through a question to ensure participation from audience</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">L. Set the REACTION MODE with the participants, for example a thumbs up if they have understood, thumbs down if not. AVOID SHUFFLING between screens frequently</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">M. AVOID RECLINING BACK. Sit comfortably alert and erect back</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">N. SUMMARISE at the end of each module/sub-topic and ask questions </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">O. Dedicate a time slot at the end of session for Q &amp; A </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">P. Make yourself always VISIBLE ON VIDEO </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">Basic hygiene checks</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Dress professionally as appropriate to the session </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Avoid wearing too much of jewellery </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Look calm and confident </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Ensure steady internet connection</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Ensure gear like webcams, headsets, laptops, software updates are in order</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Continuous talking makes one thirsty, hence, water should be arranged beforehand</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Maintain eye contact with the participants </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Use suitable gestures to emphasize/illustrate your point</span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Bring in good humor and involvement when required to engage the participants </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Take appropriate pauses to ensure learning is happening </span></p>
<p className="v1v1MsoNormal" style="mso-margin-top-alt: auto; mso-margin-bottom-alt: auto"><span style="mso-fareast-language: EN-IN">• Watch for signs that participants are lost, bored, or tired</span></p>
<p className="v1v1MsoNormal">&nbsp;</p>
<br><h6>Thanks & Regards,</h6><h6>Wagons Learning Pvt. Ltd.</h6><h6>Landline: 8149006055</h6><h6>Website: <a href="http://www.wagonslearning.com" target="_blank">http://www.wagonslearning.com</a></h6><h6>Address: A/7-8, 4th Floor, Srushti, Opposite Union Bank, Baner Road, Pune – 411045</h6><br><h6><strong>"Partnering and fulfilling employees professional knowledge and skilling journey is both our goal and reward!"</strong></h6><span lang="EN-IN" style="color: black"><img border="0" width="191" height="73" style="width: auto; height: 60px" src="https://training.wagonslms.com/wagon-login.png" alt="wagons"></span></body>`;
  return body;
}
