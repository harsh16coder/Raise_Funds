import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { getETHPrice, getWEIPriceInUSD } from "../lib/getETHPrice";
import {
  Heading,
  useBreakpointValue,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Container,
  SimpleGrid,
  Box,
  Divider,
  Skeleton,
  Img,
  Icon,
  chakra,
  Tooltip,
  Link,
  SkeletonCircle,
  HStack,
  Stack,
  Progress,
} from "@chakra-ui/react";

import factory from "../smart-contract/factory";
import web3 from "../smart-contract/web3";
import Campaign from "../smart-contract/campaign";
import { ExternalLinkIcon, EmailIcon } from "@chakra-ui/icons";
import { FaHandshake } from "react-icons/fa";
import {
  FcAbout,
  FcShare,
  FcPlus,
  FcSynchronize,
  FcServices,
  FcOk,
  FcTodoList,
  FcPrivacy,
} from "react-icons/fc";

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  console.log(campaigns);

  return {
    props: { campaigns },
  };
}

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={useColorModeValue("gray.100", "gray.700")}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
    </Stack>
  );
};

function CampaignCard({
  name,
  description,
  creatorId,
  imageURL,
  id,
  balance,
  target,
  ethPrice,
}) {
  return (
    <NextLink href={`/campaign/${id}`}>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        maxW={{ md: "sm" }}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        transition={"transform 0.3s ease"}
        _hover={{
          transform: "translateY(-8px)",
        }}
      >
        <Box height="18em">
          <Img
            src={imageURL}
            alt={`Picture of ${name}`}
            roundedTop="lg"
            objectFit="cover"
            w="full"
            h="full"
            display="block"
          />
        </Box>
        <Box p="6">
          <Flex
            mt="1"
            justifyContent="space-between"
            alignContent="center"
            py={2}
          >
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {name}
            </Box>

            <Tooltip
              label="Contribute"
              bg={useColorModeValue("white", "gray.700")}
              placement={"top"}
              color={useColorModeValue("gray.800", "white")}
              fontSize={"1.2em"}
            >
              <chakra.a display={"flex"}>
                <Icon
                  as={FaHandshake}
                  h={7}
                  w={7}
                  alignSelf={"center"}
                  color={"teal.400"}
                />{" "}
              </chakra.a>
            </Tooltip>
          </Flex>
          <Flex alignContent="center" py={2}>
            {" "}
            <Text color={"gray.500"} pr={2}>
              by
            </Text>{" "}
            <Heading size="base" isTruncated>
              {creatorId}
            </Heading>
          </Flex>
          <Flex direction="row" py={2}>
            <Box w="full">
              <Box
                fontSize={"2xl"}
                isTruncated
                maxW={{ base: "	15rem", sm: "sm" }}
                pt="2"
              >
                <Text as="span" fontWeight={"bold"}>
                  {balance > 0
                    ? web3.utils.fromWei(balance, "ether")
                    : "0, Become a Donor "}
                </Text>
                <Text
                  as="span"
                  display={balance > 0 ? "inline" : "none"}
                  pr={2}
                  fontWeight={"bold"}
                >
                  {" "}
                  ETH
                </Text>
                <Text
                  as="span"
                  fontSize="lg"
                  display={balance > 0 ? "inline" : "none"}
                  fontWeight={"normal"}
                  color={useColorModeValue("gray.500", "gray.200")}
                >
                  (${getWEIPriceInUSD(ethPrice, balance)})
                </Text>
              </Box>

              <Text fontSize={"md"} fontWeight="normal">
                target of {web3.utils.fromWei(target, "ether")} ETH ($
                {getWEIPriceInUSD(ethPrice, target)})
              </Text>
              <Progress
                colorScheme="teal"
                size="sm"
                value={web3.utils.fromWei(balance, "ether")}
                max={web3.utils.fromWei(target, "ether")}
                mt="2"
              />
            </Box>{" "}
          </Flex>
        </Box>
      </Box>
    </NextLink>
  );
}

export default function Home({ campaigns }) {
  const [campaignList, setCampaignList] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);

  async function getSummary() {
    try {
      const summary = await Promise.all(
        campaigns.map((campaign, i) =>
          Campaign(campaigns[i]).methods.getSummary().call()
        )
      );
      const ETHPrice = await getETHPrice();
      updateEthPrice(ETHPrice);
      console.log("summary ", summary);
      setCampaignList(summary);

      return summary;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div>
      <Head>
        <title>RaiseHands</title>
        <meta
          name="description"
          content="Transparent Crowdfunding in Blockchain"
        />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} align={"left"}>
          {" "}
          <Heading
            textAlign={useBreakpointValue({ base: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            as="h1"
            py={4}
          >
            Crowdfunding using the power of <br /> crypto ♦, Fintech 💱 &
            Blockchain.📦 <br />
            <p>Come join hands in making the world a better place! 🕊️ </p>
          </Heading>
          <NextLink href="/campaign/new">
            <Button
              display={{ sm: "inline-flex" }}
              fontSize={"md"}
              fontWeight={600}
              color={"white"}
              bg={"green.400"}
              _hover={{
                bg: "gray.300",
              }}
            >
              Create Campaign
            </Button>
          </NextLink>
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="aboutus">
          <HStack spacing={2}>
            <SkeletonCircle size="4" />
            <Heading as="h2" size="lg">
              {<Icon as={FcAbout} w={10} h={10} />} About Us
            </Heading>
          </HStack>
          <Divider marginTop="4" />
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={10} py={8}>
            <Text>
              We are RaiseHands,a fintech platform based on blockchain
              technology created with a unified purpose towards solving the
              issue of crowdfunding in today's time.
            </Text>
            <Text>
              Conventional Crowdfunding social platforms have been enabling
              environments for scammers and bogus donation claims. It only takes
              a few easy steps to create a fake profile on most crowdfunding
              sites, collect donations for sham projects and raise funds for
              tragedy victims who will never receive them. So, how does one
              protect both creators and donors, allowing new projects and
              initiatives to secure funding and flourish, at no significant risk
              to either party? This is where Blockchain comes in.
            </Text>
            <Text>
              When a creator presents the initiative of a new product,
              interested parties may choose to support the cause and secure
              access in advance of production. Each supporter transfers the
              required amount in a stable coin to an escrow wallet bound by a
              smart contract. The creator can begin production when the total
              amount in escrow reaches the target within a specified period. The
              predetermined amount from the escrow wallet will be transferred to
              the creator once consensus is reached. In this way, the smart
              contract insulates donors against judgment errors from project
              creators.
            </Text>

            <Text>Happy Crowdfunding!</Text>
          </SimpleGrid>
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
          <HStack spacing={2}>
            <SkeletonCircle size="4" />
            <Heading as="h2" size="lg">
              Crowdfunding Campaigns available 💎
            </Heading>
          </HStack>

          <Divider marginTop="4" />

          {campaignList.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
              {campaignList.map((el, i) => {
                return (
                  <div key={i}>
                    <CampaignCard
                      name={el[5]}
                      description={el[6]}
                      creatorId={el[4]}
                      imageURL={el[7]}
                      id={campaigns[i]}
                      target={el[8]}
                      balance={el[1]}
                      ethPrice={ethPrice}
                    />
                  </div>
                );
              })}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
              <Skeleton height="25rem" />
              <Skeleton height="25rem" />
              <Skeleton height="25rem" />
            </SimpleGrid>
          )}
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="howitworks">
          <HStack spacing={2}>
            <SkeletonCircle size="4" />
            <Heading as="h2" size="lg">
              How FundSpirit Works
            </Heading>
          </HStack>
          <Divider marginTop="4" />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
            <Feature
              icon={<Icon as={FcPlus} w={10} h={10} />}
              title={"Create a Campaign for Fundraising"}
              text={
                "Please enter the details about the campaign you are creating. Make sure you post a photo and current status about the Campaign. If you are an NGO, please enter your organisation details for better visibility."
              }
            />
            <Feature
              icon={<Icon as={FcShare} w={10} h={10} />}
              title={"Share your Campaign"}
              text={
                " You can share your Campaign on Social Media sites like Twitter, Instagram and Facebook as well as to friends, peers and family members. Make sure to post relevant information and current status about the campaign."
              }
            />
            <Feature
              icon={<Icon as={FcSynchronize} w={10} h={10} />}
              title={"Requesting and Withdrawing Funds"}
              text={
                "The funds raised by donation can be withdrawn directly to the recipient when atleast 50% of the contributors approve of the Withdrawal Request. The creator is not the intermediary of the transfer of funds."
              }
            />
          </SimpleGrid>
        </Container>
        <Heading as="h2" size="lg" mt="8">
          Steps for Crowdfunding <Icon as={FcServices} w={20} h={20} />
        </Heading>
        <Feature
          icon={<Icon as={FcPlus} w={10} h={10} />}
          text={
            "1️⃣To participate and complete a transaction [creating your own campaign or to contribute], you first need to connect an Ethereum Wallet ♦ to the website."
          }
        />
        <Feature
          icon={<Icon as={FcPrivacy} w={10} h={10} />}
          text={
            "2️⃣For this you can use Metamask, a popular software cryptocurrency wallet used to access an Ethereum Wallet through a browser extension or mobile app."
          }
        />
        <Feature
          icon={<Icon as={FcTodoList} w={10} h={10} />}
          text={
            "3️⃣Metamask supports IOS, Android native applications along with Chrome, Firefox, Brave, and the Edge Browser.To Install it, check the link given down below."
          }
        />
        <Feature
          icon={<Icon as={FcOk} w={10} h={10} />}
          text={
            "4️⃣Once you have completed the steps and created a Metamask wallet, you can create and contribute to campaigns.Thats it.Get Started with Crowdfunding"
          }
        />
        <Heading text={""} />
        Follow this Link for Metamask Installation⤵️{" "}
        <Link color="green.500" href="https://metamask.io/" isExternal>
          <ExternalLinkIcon mx="16px" />
        </Link>{" "}
        <Heading as="h2" size="lg" mt="8">
          For any Queries please send a mail{" "}
          <Link color="green.500" href="mailto:kyremz13@gmail.com" isExternal>
            <EmailIcon mx="2px" />
          </Link>{" "}
        </Heading>
        <Divider marginTop="4" />
      </main>
    </div>
  );
}