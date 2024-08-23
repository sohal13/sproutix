import React from 'react'
import FeaturedPlants from './Components/HomeComponents/FeaturedPlants'
import PopularSellers from './Components/HomeComponents/PopularSellers'
import Promotions from './Components/HomeComponents/Promotions'
import HeroSection from './Components/HomeComponents/HeroSection'
import Navbar from './Components/Layout/Navbar'
import Footer from './Components/Layout/Footer'
import Layout from './Components/Layout/Layout'

const Home = () => {
  return (
    <Layout>
      <HeroSection/>
    <FeaturedPlants />
     {/*<PopularSellers />*/}
      {/*<Promotions />*/}
    </Layout>
  )
}

export default Home