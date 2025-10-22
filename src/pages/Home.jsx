import { Link, NavLink } from "react-router-dom";
import Layout from "../shared/Layout/Layout";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import { ArrowRight } from "lucide-react";
import SlideSwiper from "../components/HomeComponents/SlideSwiper";
import BestSeller from "../components/HomeComponents/BestSeller";


const Home = () => {

  return (
    <Layout>
      <div className="w-full min-h-screen bg-primary flex flex-col justify-center items-center">
        <NavLink
          to={""}
          className="inline-block rounded-full mt-8 md:mt-20 p-[2px] bg-gradient-to-r from-white to-bg-primary mb-8 text-sm"
        >
          <div className="rounded-full px-8 py-3 bg-primary text-white">
            New collection 2025
          </div>
        </NavLink>
        
        <h1 className="font-sans text-xl px-8 md:text-5xl md:px-48 text-center text-white font-semibold mb-6 leading-10">
          Where style meets expression, trends inspire, and fashion thrives.
        </h1>
        
        <p className="font-sans px-10 text-gray-300 text-sm md:text-base text-center mb-8 max-w-3xl mx-auto">
          Step into a fashion haven where the latest trends meet your unique
          style aspirations. Redefine your wardrobe with Desober today!
        </p>
        
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-medium">
          New collection
          <div className="bg-black text-white rounded-full p-2">
            <ArrowRight size={16} />
          </div>
        </button>

        <SlideSwiper/>

        <BestSeller/>

      </div>
    </Layout>
  );
};

export default Home;