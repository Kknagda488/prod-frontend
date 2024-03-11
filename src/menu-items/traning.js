// assets

import { SiGoogleclassroom } from "react-icons/si";
import {

  RiPlayListAddFill,
} from "react-icons/ri";

import {

  MdOutlineModelTraining,
} from "react-icons/md";
import { PiCertificateBold } from "react-icons/pi";
import {
  TbCertificate,
} from "react-icons/tb";



import { BsFileEarmarkBarGraph } from "react-icons/bs";
// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'training',
  //title: 'Training',
  type: 'group',
  children: [
    {
      id: 'training',
      title: 'Training',
      type: 'collapse',
      icon: MdOutlineModelTraining,

      children: [
        {
          id: 'program',
          title: 'Program',
          type: 'item',
          icon: SiGoogleclassroom,
          url: 'program',
          target: false
        },
        {
          id: 'certificate',
          title: 'Certificate',
          type: 'item',
          icon: PiCertificateBold,
          url: 'certificate',
          target: false
        }
      ]
    }]
};

export default pages;
