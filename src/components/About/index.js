import React, { Component } from 'react';
import './style.css';
import { Row, Col } from 'react-bootstrap';
import ReadMore from "../../helpers/readMore";

const interns = [
  {
    title: "Fall 2021 Interns",
    video: ["https://www.youtube.com/embed/maOmzv7p-RU"],
    interns_list: [
      {
        name: "Rayanna Harduarsingh",
        job_title: "Operations Employee",
        description: `Rayanna Harduarsingh is an Operations Assistant at GoFundHer from Queens, New York. She is currently a Master’s Candidate in Data Science at Syracuse University. She has also received her bachelor’s in Advertising and Information Technology from Syracuse. Her ultimate goal is to get into the world of digital marketing. She is so excited to join the GoFundHer family and contribute to the empowerment of women by helping them achieve their goals through this platform.`,
        image: "assets/img/about/interns/img_intern35.jpg",
      },
    ],
  },
  {
    title: "Summer 2021 Interns",
    video: [],
    interns_list: [
      {
        name: "Tanha Patel",
        job_title: "Operations Intern",
        description: `Tanha Patel is da finance intern at GoFundHer from the UK. She is currently studying Economics at the University of Birmingham and looks forward to having her first internship experience with GoFundHer! She hopes to work for a financial company in the future. In her spare time she enjoys going to different food places across London and travelling around.`,
        image: "assets/img/about/interns/img_intern2.png",
      },
    ],
  },
  {
    title: "Winter 2020 Interns",
    video: [
      "https://www.youtube.com/embed/ByMWK50PAI0",
      "https://www.youtube.com/embed/hGkjIZc4rWs",
    ],
    interns_list: [
      {
        name: "Megan Miceli",
        job_title: "Public Relations Intern",
        description: `Megan Miceli is the Public Relations Intern at GoFundHer.  She recently graduated from Baruch College in 2020 with a Bachelor’s Degree in Communication Studies & a minor in Law & Policy.  While she has had prior PR intern experience working at boutique lifestyle PR firms, she is excited to finally get the chance to work in house for such a unique company.  She is extremely passionate about empowering females and cannot wait to help others achieve their goals during her time at GoFundHer.  In her spare time she enjoys hiking, reading psychological thrillers, and trying out every restaurant that NYC has to offer!`,
        image: "assets/img/about/interns/img_intern3.jpg",
      },
      {
        name: "Katelyn Wasko",
        job_title: "Video Editing intern",
        description: `Katelyn Wasko is a video editing intern at GoFundHer and has a bachelor in Digital Filmmaking with a minor in Journalism. She hopes that, with her editing skills and knowledge of YouTube (from 11 years as a YouTuber with over 12k subscribers),  to be able to help GoFundHer and, in return, women as a whole.
          During her off time, she enjoys movies, music videos (a business she hopes to work in one day), music, animals, research and anything that makes her laugh.`,
        image: "assets/img/about/interns/img_intern4.jpg",
      },
      {
        name: "Sarah RYDEL",
        job_title: "Social Media intern",
        description: `Sarah is a Social Media intern for GoFundHer.com and City Girls Big Dreams. She received her BFA from Michigan State University in Studio Art. She is a graphic designer and works with the Performing Arts community in the Greater New York City area. Sarah immediately connected to the mission and values of GFH/CGDB to support women. Through this internship, Sarah is inspired to promote goals by developing the GFH/CGDB brand and expanding her knowledge of media production.`,
        image: "assets/img/about/interns/img_intern5.jpg",
      },
      {
        name: "Yutong Mo",
        job_title: "Operations Intern",
        description: `Yutong is an Operations Intern for GoFundHer. She has a BA in Economics. Currently, she is a master's student majored in integrated marketing at New York University. She loves to watch movies, and occasionally play some video games in her spare time. For a long-term career goal, she is very interested in marketing-related positions, and she really wants to participate and make a difference in this field.`,
        image: "assets/img/about/interns/img_intern6.jpg",
      },
      {
        name: "Amand Olsen",
        job_title: "Operations Coordinator Intern",
        description: `Amanda Olsen holds an MFA in Creative Writing and a BA in English Literature. After 15 years in higher education she is now a grant writing intern at gofundher.com. She is a writer, a mother, a teacher, and a fiber artist. In precious spare moments you might find her spinning yarn or writing YA spec fic about brave, sassy girls who don’t need saving.  `,
        image: "assets/img/about/interns/img_intern7.jpg",
      },
      {
        name: "Kyra Russo",
        job_title: "Operations Intern",
        description: `Kyra Russo is an Operations Intern for GoFundHer. She graduated from Syracuse University (Go Orange!) in 2020 with a BA in Public Policy with a concentration in Environmental Studies. She has an affinity for fashion and loves to travel. She hopes to work for a sustainable fashion company in the future. She is looking forward to gaining more experience in leadership and management through this role. In her spare time she enjoys being with the people she loves, preferably outside in beautiful sunny weather, and spending time with her puppy!`,
        image: "assets/img/about/interns/img_intern8.jpg",
      },
    ],
  },
  {
    title: "Fall 2020 Interns",
    video: [
      "https://www.youtube.com/embed/vDPNRqy8wp8",
      "https://www.youtube.com/embed/DkISkr-k6DA",
      "https://www.youtube.com/embed/alY3O6aO82A",
    ],
    interns_list: [
      {
        name: "Rivka Bondar",
        job_title: "Social Media Intern",
        description: `Rivka Bondar has a BBA in Entrepreneurship from Baruch College. After interning in the fashion industry, she decided to start a jewelry line. Her ultimate goal is to become a venture capitalist and invest in women-owned businesses. When she’s not working, she likes to bake, watch reality T.V. and go to concerts/events around the city.
        Her instagram handle is @rivkabondar`,
        image: "assets/img/about/interns/img_intern9.jpg",
      },
      {
        name: "Jennifer Pineda",
        job_title: "Social Media Intern",
        description: `Jennifer Pineda has a Bachelor’s degree in English Writing Arts with a minor in Gender & Women’s Studies. She hopes to one day go into editing so that she can spend all day reading books. She loves to write, but she loves to complain about her writing even more. And she has a slight obsession with Scooby-Doo. You can find her on Instagram at @ibecameasmadasrabbits`,
        image: "assets/img/about/interns/img_intern10.png",
      },
      {
        name: "Stephanie Hempel",
        job_title: "Grant Writer Intern",
        description: `Stephanie Hempel, MFA is a graduate of Naropa University's Jack Kerouac School of Disembodied Poetics. She is a multi-genre writer, grant writer, artist, editor, freelance content creator, and performance artist. She is the Co-Founder and Editor-In-Chief of the literary magazine, Tiny Spoon, and is currently working with the literary journal, The Bombay Gin. She teaches at the Wisdom Body Artist Collective. Find more about her here: <a href="https://shspeaks17.wixsite.com/stephaniemichele" target="_blank">https://shspeaks17.wixsite.com/stephaniemichele</a> `,
        image: "assets/img/about/interns/img_intern11.jpg",
      },
      {
        name: "Tracy Clegg",
        job_title: "Grant Writer Intern",
        description: `Tracy Clegg is a grant writing intern at GoFundHer.com. She has worked in litigation for over twenty years in civil rights,entertainment and business. She earned her Bachelor's degree from the University of Oregon, and her law degree from the University of West Los Angeles. Her path has now led her to GoFundHer.com and City Girls Big Dreams to get experience in a successful grant writing campaign while having the opportunity to support women on a quest to fulfill their dreams.
        LinkedIn: <a href="https://www.linkedin.com/in/tracy-clegg-25744011" target="_blank">https://www.linkedin.com/in/tracy-clegg-25744011</a>`,
        image: "assets/img/about/interns/img_intern12.jpg",
      },
      {
        name: "Emma Brousseau",
        job_title: "Grant Writer Intern",
        description: `
        Emma Brousseau is a grant writing intern at GoFundHer.com. She earned her master’s in English/Creative Writing at Texas Tech University where she also worked as an Associate Editor for Iron Horse Literary Review. For her thesis, she wrote a linked short story collection about women and the apocalypse. You can find out more about her and her published work at emmabrousseau.com.
         Twitter: @Emma_Brousseau`,
        image: "assets/img/about/interns/img_intern13.jpg",
      },
      {
        name: "Kourtney Jamison",
        job_title: "YouTube Media Intern",
        description: `Kourtney Jamison is a 24 year old recent graduate student from Springfield, IL. She graduated from Southern Illinois University Edwardsville with a Bachelor’s degree in Mass Communications and a minor in Sociology. She’s now pursuing a Master’s in Marketing Communications. Kourtney loves to create content for YouTube, hang out with friends, watch anime, and go shopping. Her dream is to one day work for a production company editing movies/videos, or working in social media.
        Instagram: <a href="https://www.instagram.com/twinnietower2/" target="_blank">https://www.instagram.com/twinnietower2/</a>
        Linkedin: <a href="https://www.linkedin.com/in/kourtney-jamison-931a8bb0/" target="_blank">https://www.linkedin.com/in/kourtney-jamison-931a8bb0/</a>`,
        image: "assets/img/about/interns/img_intern14.jpg",
      },
      {
        name: "Heavon Clark",
        job_title: "Public Relations Intern",
        description: `Heavon Clark is a Public Relations Intern at GoFundHer, she has an Bachelor’s Degree in Media Communications and she is currently in a graduate program studying Public Relations. She is currently working towards her dream and goals of becoming an PR agent, she is hopeful to use the skills of her internships and degrees to help and brand individuals' image.`,
        image: "assets/img/about/interns/img_intern15.jpg",
      },
      {
        name: "Amanda Olsen",
        job_title: "Grant Writer Intern",
        description: `Amanda Olsen holds an MFA in Creative Writing and a BA in English Literature. After 15 years in higher education she is now a grant writing intern at gofundher.com. She is a writer, a mother, a teacher, and a fiber artist. In precious spare moments you might find her spinning yarn or writing YA spec fic about brave, sassy girls who don’t need saving. `,
        image: "assets/img/about/interns/img_intern7.jpg",
      },
      {
        name: "Sarah Cusack",
        job_title: "Public Relations Intern",
        description: `Sarah is one of the Public Relations Intern at GoFundHer and has just earned her bachelor’s degree in communications with a minor in business. She is passionate about having a career that will allow her to use her writing skills to help advocate for other women. When Sarah isn’t working, she loves to draw and try cooking new recipes.`,
        image: "assets/img/about/interns/img_intern16.jpg",
      },
      {
        name: "Sanjida Khan",
        job_title: "YouTube Media Intern",
        description: `Sanjida Khan is a Youtube Director Intern at GoFundHer. She focuses on creating content, working on script, and editing videos with the Youtube team. She is currently a college student in New York City studying Digital Marketing and she plans to use her skills as well as gain new ones in the marketing and tech field.`,
        image: "assets/img/about/interns/img_intern17.jpg",
      },
      {
        name: "Laura Barham",
        job_title: "Social Media Intern",
        description: `Laura is a Social Media Intern for GoFundHer and City Girls Big Dreams. She graduated from The University of Virginia where she majored in Anthropology and Linguistics. Her interest in Social Media and Marketing united with the cause of supporting women and girls brought her to GoFundHer and CGBD. In her spare time, she enjoys hiking, reading, and spending time with family and friends. She hopes the skills she receives throughout her internship will propel her into the field of Digital Media and Marketing.`,
        image: "assets/img/about/interns/img_intern18.jpg",
      },
      {
        name: "Manzura Albekova",
        job_title: "YouTube Media Intern",
        description: `Manzura Albekova is a YouTube Media Intern for GoFundHer and City Girls Big Dreams. She has recently graduated with her Bachelors in Electronic Media and Mass Communication concentrated on Digital Media with Communication Studies. She has a passion for film, art and music. In her free time, she enjoys going on walks and spending time with her family. Through this internship, she hopes to share some ideas and gain experience in different areas such as social media, and marketing.`,
        image: "assets/img/about/interns/img_intern19.jpg",
      },
      {
        name: "Kaitlyn Carmack",
        job_title: "Social Media Intern",
        description: `Kaitlyn is a social media intern for City Girls Big Dreams and GoFundHer. She attended the University of Florida and recently graduated with a Bachelors of Arts in Anthropology. While at UF, she was exposed to business electives which eventually led to an interest in social media marketing. That fascination coupled with CGBD/GFH’s mission and goals made this internship a perfect match. With this experience gained, Kaitlyn hopes to work in social media marketing or marketing within a museum. Outside of this internship, Kaitlyn experiments with makeup, plays electric guitar, and manages her custom-made t-shirt business.`,
        image: "assets/img/about/interns/img_intern20.png",
      },
      {
        name: "Rebekah Dodds",
        job_title: "Social Media Intern",
        description: `Rebekah is a Social Media Intern for GoFundHer/CGBD. She has a BA in English Literature, with a minor in Theatre. Her hobbies include lots of reading, bike riding, watching DIY tiktoks, and listening to podcasts. Her long term goal is to work in Marketing in the Publishing industry, and hopes this internship will give her lots of insight into the job.
        Check her out on LinkedIn here: LinkedIn Profile`,
        image: "assets/img/about/interns/img_intern21.jpg",
      },
      {
        name: "Tanisha Solomon",
        job_title: "Social Media Intern",
        description: `Tanisha is a young professional and Social Media Intern at GoFundHer. She recently graduated with a B.A in Communication from SUNY Oswego and hopes to jumpstart a career in digital marketing or public relations. Her long term goal is to use her skills to serve underrepresented groups and give back to her community. She enjoys travelling and can easily be found exploring the ins and outs of major US cities. In her spare time, she loves attempting DIY projects, spending quality time with loved ones, and watching YouTube videos.`,
        image: "assets/img/about/interns/img_intern22.jpg",
      },
    ],
  },
  {
    title: "Summer 2020 Interns",
    video: [
      "https://www.youtube.com/embed/w4PwlEfaPR0",
      "https://www.youtube.com/embed/DlxQpRQniJ8",
      "https://www.youtube.com/embed/gNoMsYS9sKE",
    ],
    interns_list: [
      {
        name: "Iniko Ntosake",
        job_title: "Social Media Marketing",
        description: `Iniko Ntosake is a social media marketing intern at GoFundHer.com. She earned her Bachelor’s degree in Psychology from Princeton University in 2017. Her professional interests include marketing and communications. Outside of work, she enjoys spending time with friends and family, volunteering on organic farms, and playing with her rescue dog, Zinga.
        Her Instagram handle is @inikoiniko`,
        image: "assets/img/about/interns/img_intern23.jpg",
      },
      {
        name: "Julia Scully",
        job_title: "Social Media Intern",
        description: `Julia is an aspiring professional pursuing a graduate degree in communications. She wrote her undergraduate thesis on contemporary women's issues and dedicates herself to uplifting women and girls however possible. Julia is the proud owner of a one-year-old puppy named Chester and a pop-culture enthusiast. Her Linkedin is <a href="https://www.linkedin.com/in/julia-scully-580041126/" target="_blank">https://www.linkedin.com/in/julia-scully-580041126/</a>`,
        image: "assets/img/about/interns/img_intern24.jpg",
      },
      {
        name: "Leah St. Clair",
        job_title: "Social Media Intern",
        description: `Leah St. Clair is a recent college graduate with a Bachelor’s degree in Communications with a minor in Marketing. Her dream job is to be a social media strategist especially for those that are small startup companies and make her way to big companies. Leah loves using her writing skills for her work and outside her work. When she is not working, she is either cooking or playing Animal Crossing on her Nintendo Switch. Her Instagram handle is @l.eeuh and her Linkedin is <a href="https://www.linkedin.com/in/leah-stclair-aa7850145/" target="_blank">https://www.linkedin.com/in/leah-stclair-aa7850145/</a>`,
        image: "assets/img/about/interns/img_intern25.jpg",
      },
      {
        name: "Kim-Moi Chin",
        job_title: "Social Media Intern",
        description: `Kim-Moi Chin, 23 years old, native from Brooklyn, NY. Process a Bachelor’s in Art majoring in journalism. First in her family to graduate from a four-year institution. Driven by a single mother who instilled through hard work and persistence the sky’s the limit. Currently pursuing a career in the communication field, as a multimedia journalist (MMJ). Her Linkedin: <a href="linkedin.com/in/kim-moi-chin-a05945b8" target="_blank">linkedin.com/in/kim-moi-chin-a05945b8</a>
        Email: <a href="mailto:Kimmoic@gmail.com">Kimmoic@gmail.com</a>`,
        image: "assets/img/about/interns/img_intern26.jpg",
      },
      {
        name: "Kourtney Jamison ",
        job_title: "Social Media Coordinator",
        description: `Kourtney Jamison is a 24 year old recent graduate student from Springfield, IL. She graduated from Southern Illinois University Edwardsville with a Bachelor’s degree in Mass Communications and a minor in Sociology. She’s now pursuing a Master’s in Marketing Communications. Kourtney loves to create content for YouTube, hang out with friends, watch anime, and go shopping. Her dream is to one day work for a production company editing movies/videos, or working in social media.
        Instagram: <a href="https://www.instagram.com/twinnietower2/" target="_blank">https://www.instagram.com/twinnietower2/</a>
        Linkedin: <a href="https://www.linkedin.com/in/kourtney-jamison-931a8bb0/" target="_blank">https://www.linkedin.com/in/kourtney-jamison-931a8bb0/</a>`,
        image: "assets/img/about/interns/img_intern14.jpg",
      },
      {
        name: "Zara Hanif",
        job_title: "Social Media Intern",
        description: `Zara Hanif is a research intern at GoFundHer.com. She is a summer/fall intern, but you can call her the invisible one. She has a BA in English, and is going back to school for Web Development and Design. She has a lot of ideas, but so little time. Her favorite things to do are make graphics, learn new things, draw, listen to music, and gardening.
        Instagram: <a href="zara_hanif3002" target="_blank">zara_hanif3002</a>
        Linkedin: <a href="https://www.linkedin.com/in/zara-hanif-078544b4/" target="_blank">https://www.linkedin.com/in/zara-hanif-078544b4/</a>`,
        image: "assets/img/about/interns/img_intern27.jpg",
      },
      {
        name: "Yao He",
        job_title: "Social Media Intern",
        description: ``,
        image: "assets/img/about/interns/img_intern28.jpg",
      },
    ],
  },
  {
    title: "Spring 2020 Interns",
    video: [],
    interns_list: [
      {
        name: "May Wang",
        job_title: "Graphics & Social Media Intern",
        description: ``,
        image: "assets/img/about/interns/img_intern30.jpg",
      },
      {
        name: "Madelyn De Los Santos",
        job_title: "HR Intern",
        description: ``,
        image: "assets/img/about/interns/img_intern29.jpg",
      },
      {
        name: "Shornette Figaro",
        job_title: "Social Media Intern",
        description: ``,
        image: "assets/img/about/interns/img_intern31.jpg",
      },
      {
        name: "Ngan Pham",
        job_title: "Social Media Intern",
        description: ``,
        image: "assets/img/about/interns/img_intern37.jpg",
      },
      {
        name: "Rosalba Fermin",
        job_title: "Social Media Intern",
        description: ``,
        image: "assets/img/about/interns/img_intern36.jpg",
      },
    ],
  },
];

const staff_freelancer = [
  {
    name: "Amanda Olsen",
    image: "assets/img/about/img_staff1.jpg",
    designation: "Content Writer",
  },
  {
    name: "Humera Jabeen",
    image: "assets/img/about/img_staff2.jpg",
    designation: "Virtual Assistant ",
  },
  {
    name: "Rayanna Harduarsingh",
    image: "assets/img/about/interns/img_intern35.jpg",
    designation: "Operations Employee",
  },
  {
    name: "Johara Jaman",
    image: "assets/img/about/img_staff3.jpg",
    designation: "Email Marketer",
  },
  {
    name: "Frajlla",
    image: "assets/img/about/img_staff4.jpg",
    designation: "Zendesk Specialist",
  },
];
const chapter_team = [
  {
    name: "Anand Jain",
    designation: "Project Manager",
    image: "assets/img/about/img_chapter2.jpg",
  },
  {
    name: "DAMINI JAIN",
    designation: "Project Coordinator",
    image: "assets/img/about/img_chapter1.jpg",
  },
  {
    name: "Aayushi Jain",
    designation: "Developer",
    image: "assets/img/about/aayushi.png",
  },
  {
    name: "Prachi Jain",
    designation: "Designer",
    image: "assets/img/about/prachi.jpg",
  },
];
const business_partners = [
  {
    image: "/assets/img/sponsor-imgs/img_partner1.png",
    url: "https://isocialpr.com/",
  },
  {
    image: "/assets/img/sponsor-imgs/img_partner2.png",
    url: "https://www.interdependence.com/",
  },
  {
    image: "/assets/img/sponsor-imgs/img_partner3.png",
    url: "https://isocialpr.com/",
  },
];
const founding_partners = [
  {
    name: "Francesca Mensah",
    image: "assets/img/about/interns/img_intern38.jpg",
  },
  {
    name: "Dr. Vincent Mensah PhD",
    image: "assets/img/about/interns/img_intern39.jpg",
  },
  {
    name: "Tracy Garley",
    image: "assets/img/about/interns/img_intern34.jpg",
  },
  {
    name: "Roger Mensah",
    image: "assets/img/about/interns/img_intern32.jpg",
  },
  {
    name: "Dr. Cheryl Mensah MD",
    image: "assets/img/about/interns/img_intern33.jpg",
  },
];

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <section className='treasure-wrapper'>
          <h2>About GoFundHer</h2>
        </section>
        <section className='our-story-wrap'>
          <div className='container text-center'>
            <div className='section-title text-center active-project-wrap'>
              <h2 className='small-text-bg'>Our Story</h2>
            </div>
            <p className='font-size-18 light-gray-clr'>
              GoFundHer is a crowdfunding platform for equality. <br /> We
              believe the best way to support girls and women is with direct
              deposits.
            </p>
          </div>
        </section>
        <section className='xs-partner-section supported-countries-wrap'>
          <div className='container'>
            <div className='xs-partner-content text-center'>
              <div className='xs-heading'>
                <h2 className='xs-title heading-about-us'>
                  <span>Available Worldwide</span>
                </h2>
              </div>
              <p>
                Available in Asia, Africa, South America, North America,
                <br /> Europe & Australia!
              </p>
              <div className='mt-3'>
                <img
                  className='map-img'
                  src='/assets/img/about/img_map.png'
                  alt='Supported Countries'
                />
              </div>
            </div>
          </div>
        </section>
        <section className='section-wrap'>
          <div className='container text-center'>
            <div className='section-title text-center active-project-wrap'>
              <h2 className='small-text-bg'>Interns</h2>
            </div>
            <Row>
              <Col sm={12}>
                <div className='video-banner-wrap'>
                  <iframe
                    src='https://www.youtube.com/embed/EbY_YJXzyX8'
                    frameborder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowfullscreen
                  ></iframe>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        {interns.map((intern) => (
          <section className='section-wrap'>
            <div className='container text-center'>
              <div className='section-title text-center active-project-wrap'>
                <h2 className='small-text-bg'>{intern.title}</h2>
              </div>
              <Row className='mt-4 interns-wrapper justify-content-center'>
                {intern.video.map((item) => (
                  <Col
                    className='video-col'
                    sm={intern.video.length > 1 ? 6 : 12}
                  >
                    <div
                      className={`video-banner-wrap ${
                        intern.video.length > 1 ? "intern-video" : ""
                      }`}
                    >
                      <iframe
                        src={item}
                        frameborder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowfullscreen
                      ></iframe>
                    </div>
                  </Col>
                ))}
              </Row>
              <Row className='mt-4 interns-wrapper container-sp justify-content-center'>
                {intern.interns_list.map((item) => (
                  <Col sm={6} md={4} className='d-flex'>
                    <div className='our-team-wrap about-team'>
                      <div className='our-team-img'>
                        <img
                          src={
                            item.image
                              ? item.image
                              : "assets/img/about/img_default.png"
                          }
                          alt='Intern'
                        />
                      </div>
                      <div className='our-team-title about-team-details'>
                        <h3 className="mt-0 mb-2">{item.name}</h3>
                        <h5 className='m-0'>{item.job_title}</h5>
                      </div>
                      
                      {/* <div className='our-team-details'>
                        {item.description.length >= 200 ? (
                          <ReadMore
                            internDescription={item.description}
                            limit={200}
                          />
                        ) : (
                          <ReadMore internDescription={item.description} />
                        )}
                        <button className='btn btn-submit mt-4'>Follow</button>
                      </div> */}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </section>
        ))}
        <section className='bg-gray xs-partner-section freelancer-wrapper'>
          <div className='container'>
            <div className='xs-partner-content text-center'>
              <div className='xs-heading'>
                <h2 className='xs-title heading-about-us'>
                  <span>Staff & Freelancers</span>
                </h2>
              </div>
            </div>
            <div className='assistanc-freelanc-wrap'>
              <Row className='container-sp'>
                {staff_freelancer.map((item) => (
                  <Col sm={6} md={3}>
                    <div className='our-assistance'>
                      <div>
                        <img src={item.image} alt='Assistance & Freelancer' />
                      </div>
                      <div className='our-assistance-details'>
                        <h3 className='sub-title mb-2'>{item.name}</h3>
                        <h5 className='more-small-title'>
                          {item.designation}{" "}
                        </h5>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </section>
        <section className='section-wrap'>
          <div className='container text-center'>
            <div className='section-title text-center active-project-wrap'>
              <h2 className='small-text-bg'>Chapter 247 Team</h2>
            </div>
            <Row className='mt-4 chapter247-team-wrapper container-sp'>
              {chapter_team.map((item) => (
                <Col sm={6} md={3}>
                  <div className='our-team-wrap chapter-team about-team'>
                    <div className='our-team-img'>
                      <img src={item.image} alt='Chapter 247 Team' />
                    </div>
                    <div className='our-team-title'>{item.name}</div>
                    <h5 className='more-small-title'>{item.designation}</h5>
                  </div>
                </Col>
              ))}
            </Row>
            <div className='chapter-team-img'>
              <img
                src='assets/img/about/img_chapter_team.jpg'
                alt='Chapter Team'
              />
            </div>
          </div>
        </section>
        <section className='section-wrap'>
          <div className='container'>
            <div className='section-title text-center active-project-wrap'>
              <h2 className='small-text-bg'>Business Partner</h2>
            </div>
            <ul className='donors-logo-list business-partner-logo about-bus-partner'>
              {business_partners.length && business_partners
                ? business_partners.map((item, index) => (
                    <li key={index}>
                    <a href={item.url} target="_blank">
                      <img src={item.image} alt='Partner' />
                      </a>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </section>
        <section className='xs-partner-section supported-countries-wrap'>
          <div className='container'>
            <div className='xs-partner-content text-center'>
              <div className='xs-heading'>
                <h2 className='xs-title heading-about-us'>
                  <span>Founding Partners</span>
                </h2>
              </div>
              <div className='founding-partners-wrap'>
                <Row className='container-sp'>
                  {founding_partners.map((item) => (
                    <Col sm={6} md={4}>
                      <div className='our-team-wrap our-found-patner about-team'>
                        <img
                          className='rounded-img'
                          src={item.image}
                          alt='Founding Patners'
                        />
                        <div className='mt-4'>
                          <h3 className='sub-title mb-2'>{item.name}</h3>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default About;