import { MetaMaskInpageProvider } from '@metamask/providers';
import { AppRoot, Avatar, Button, Card, CardGrid, Cell, CellButton, Div, FormItem, Group, Input, ModalCard, ModalPage, ModalPageHeader, ModalRoot, Panel, PanelHeader, Paragraph, Spacing, SplitCol, SplitLayout, Title } from '@vkontakte/vkui';
import "@vkontakte/vkui/dist/vkui.css";
import React, { useRef } from 'react';
import {BigNumber, ethers} from 'ethers';
import {wait} from "@testing-library/user-event/dist/utils";
import ExchangePanel from './panels/ExchangePanel';
import HeaderPanel from './panels/HeaderPanel';

import metamaskLogo from './static/metamask.jpg'
import tonLogo from './static/ton-logo.png';
import btnLogo from './static/btn-logo.png';
import { Icon16Dropdown } from '@vkontakte/icons';
import { InputMask } from './components/InputMask';

import contract from './contracts/artifacts/ArtemBonToken.json';
import exchcontract from './contracts/artifacts/Exchange.json';

const tokenAddress = "0x5668814c373344AD35b4457A34582a44Bd5F6fB0";
const tokenAbi = contract.abi;
const exhangeAddress = "0xbFf2766b43E63826d74920c6B55D75fb2cf53847";
const exchangeAbi = exchcontract.abi;

const isDesktop = window.innerWidth >= 1400;
const isTablet = window.innerWidth >= 800;

const ModalRootFix: any = ModalRoot;

declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}

const App = () => {
    const modals = ['graph', 'login', 'liquidity'];
    const [modal, setModal] = React.useState<any>(null)

    const [torSwap, setTorSwap] = React.useState<string>('5') // Slippage Tolerance

    const { ethereum } = window; // metamask ethereum
    const [currentAccount, setCurrentAccount] = React.useState(null);

    const [activeInput, setActiveInput] = React.useState<string>('token');
    const [token, setToken] = React.useState<string>('');
    const [eth, setEth] = React.useState<string>('');

    const [activeInputLiq, setActiveInputLiq] = React.useState<string>('token');
    const [tokenLiq, setTokenLiq] = React.useState<string>('');
    const [ethLiq, setEthLiq] = React.useState<string>('');

    const [userBalanceEth, setUserBalanceEth] = React.useState<string>('0');
    const [userBalanceToken, setUserBalanceToken] = React.useState<string>('0');

    const [typeSwap, setTypeSwap] = React.useState<boolean>(true);

    const [rate, setRate] = React.useState<string>('0');

    React.useEffect(() => {
        checkWalletIsConnected();
    }, [])
    React.useEffect(() => {
        updateRate(typeSwap);
    }, [])

    const provider = new ethers.providers.Web3Provider(ethereum as any);
    const signer = provider.getSigner();
    const Exchange = new ethers.Contract(exhangeAddress, exchangeAbi, signer);
    const Token = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const fromWei = (value: string | number | BigInt | BigNumber) =>
        ethers.utils.formatEther(
            typeof value === "string" ? value : value.toString()
        );
    const toWei = (value: string | number) => ethers.utils.parseEther(value.toString());
    console.log(typeSwap)
    const updateRate = async (status: boolean) => {
        if (status) {
            const tokenRate = fromWei(await Exchange.getTokenAmount(toWei("1")));
            setRate(`1 ETH = ${parseFloat(tokenRate).toFixed(4)} ARTT`);
        } else {
            const ethRate = fromWei(await Exchange.getEthAmount(toWei("1")));
            setRate(`1 ARTT = ${parseFloat(ethRate).toFixed(4)} ETH`);
        }
    }

    const updateBalance = async (address: string) => {
        console.log(address)
        const ethBal = parseFloat(fromWei(await provider.getBalance(address)))
        const tokenBal = parseFloat(fromWei(await Token.balanceOf(address)))
        setUserBalanceToken(tokenBal.toFixed(4))
        setUserBalanceEth(ethBal.toFixed(4))
    }

    const changeTypeSwap = async () => {
        if (typeSwap) {
            setTypeSwap(false)
            await updateRate(false);
        } else {
            setTypeSwap(true)
            await updateRate(true);
        }

    }

    const addTokenToMetamask = async () => {
        const wasAdded = await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: Token.address, // The address that the token is at.
                    symbol: "ARTT", // A ticker symbol or shorthand, up to 5 chars.
                    decimals: 18, // The number of decimals in the token
                    image: "https://ipfs.io/ipfs/bafkreibz4fzytbnv3dh3lxmkzrjwlcjo52bwe6ii2cx54qmldw23zwr3ia", // A string url of the token logo
                },
            },
        });
        console.log(wasAdded);
    }

    const getAccountWrapper = async () => {
        try {
            const accounts: any = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (e) {
            console.log(e)
        }
    }

    const checkWalletIsConnected = async () => {
        if (currentAccount == null) {
            try {
                const accounts: any = await ethereum.request({method: 'eth_accounts'});
                setCurrentAccount(accounts[0]);
                await wait(1)
                updateBalance(accounts[0]);
            } catch (e) {
                console.log('Login in Metamask!')
            }
        }
    }

    const connectWalletHandler = () => {
        if (!ethereum) {
            alert("Install Metamask!");
        }
        try {
            getAccountWrapper();
        } catch (e) {
            console.log(e);
        }
    }

    const handleActiveInput = (asset: string) => {
        setActiveInput(asset);
    }

    const toSwapInputHandler = async (value: string) => {
        if (value !== '') {
            if (parseFloat(value) > 0.0) {
                if (activeInput == 'token') {
                    setToken(value);
                    const ethAmount = fromWei(await Exchange.getEthAmount(toWei(value)))
                    setEth(parseFloat(ethAmount).toFixed(4))
                }
                if (activeInput == 'eth') {
                    setEth(value)
                    const tokenAmount = fromWei(await Exchange.getTokenAmount(toWei(value)))
                    setToken(parseFloat(tokenAmount).toFixed(4))
                }
            } else if (parseFloat(value) == 0.0) {
                setToken(value)
                setEth(value)
            }
        } else {
            setEth('')
            setToken('')
        }
    }

    const swap = async () => {
        let exchange;
        const allowance = await Token.allowance(currentAccount, Exchange.address);
        if (!(parseFloat(fromWei(allowance)) >= parseFloat(token))) {
            await Token.approve(Exchange.address, toWei(100000));
        }
        console.log("Contract is allowed to use", fromWei(allowance), "ARTT");
        console.log(typeSwap);

        if (typeSwap) {             // false = Eth -> Token; true = Token -> Eth
            const ethRecv = await Exchange.getEthAmount(toWei(token));
            exchange = await Exchange.tokenToEthSwap(toWei(token), ethRecv);
        } else {
            const tokenRecv = await Exchange.getTokenAmount(toWei(eth));
            exchange = await Exchange.ethToTokenSwap(tokenRecv, { value: toWei(eth)});
        }
        exchange.wait();
    }

    const handleActiveInputLiq = (asset: string) => {
        setActiveInputLiq(asset);
    }

    const handleLiqInput = async (value: string) => {
        if (value !== '') {
            if (parseFloat(value) >= 0) {
                const exchangeBalance = await provider.getBalance(exhangeAddress);
                const exchangeTokenBalance = await Exchange.getReserve();

                const ethR = fromWei(BigInt(exchangeBalance.toString()));
                const tokenR = fromWei(BigInt(exchangeTokenBalance.toString()));

                let limitEth, limitToken;
                let rate = parseFloat(tokenR) / parseFloat(ethR); // Number of tokens for 1 eth
                let finalToken = "0", finalEth = "0";
                console.log("exchangeTokenBalance =", fromWei(exchangeTokenBalance));
                console.log("exchangeEthBalance =", fromWei(exchangeBalance));
                if (toWei(parseFloat(userBalanceToken) * rate) <= toWei(parseFloat(userBalanceEth) / rate)) {
                    limitToken = parseFloat(userBalanceToken);
                    limitEth = parseFloat(userBalanceToken) / rate;
                } else {
                    limitEth = parseFloat(userBalanceEth);
                    limitToken = parseFloat(userBalanceEth) * rate;
                }
                console.log(limitToken, limitEth)

                if (activeInputLiq == 'token') {
                    if (parseFloat(value) > limitToken) {
                        finalEth = limitEth.toFixed(4)
                        finalToken = limitToken.toFixed(4)
                    } else {
                        finalToken = value
                        finalEth = (parseFloat(value) / rate).toFixed(4);
                    }
                } else if (activeInputLiq == 'eth') {
                    if (parseFloat(value) > limitEth) {
                        finalEth = limitEth.toFixed(4)
                        finalToken = limitToken.toFixed(4)
                    } else {
                        finalEth = value
                        finalToken = (parseFloat(value) * rate).toFixed(4);
                    }
                }
                setEthLiq(finalEth);
                setTokenLiq(finalToken);
            }
        } else {
            setEthLiq('')
            setTokenLiq('')
        }
    }

    const addLiquidity = async () => {
        const allowance = await Token.allowance(currentAccount, Exchange.address);
        console.log("Contract is allowed to use", fromWei(allowance), "ARTT");
        let exchange;
        if (parseFloat(fromWei(allowance)) >= parseFloat(tokenLiq)) {
            exchange = await Exchange.addLiquidity(toWei(tokenLiq), { value: toWei(ethLiq) })
        } else {
            await Token.approve(Exchange.address, toWei(100000));
            exchange = await Exchange.addLiquidity(toWei(tokenLiq), { value: toWei(ethLiq) })
        }
        exchange.wait();
        // TODO : Add liquidity pool update
    }

    const update = () => {
        if (currentAccount != null) updateBalance(currentAccount);
        updateRate(typeSwap);
    }

    const Modals = (
        <ModalRootFix activeModal={modal}>

            {/* graph */}
            <ModalPage
                id={modals[0]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Graph</ModalPageHeader>}
            >
                <Div style={{ height: '40vh' }}>
                </Div>
            </ModalPage>

            {/* login */}
            <ModalPage
                id={modals[1]}
                onClose={() => setModal(null)}
                dynamicContentHeight
                settlingHeight={90}
                header={<ModalPageHeader>Connect wallet</ModalPageHeader>}
            >
                <Group>
                    <CardGrid size="l">
                        <Card>
                            <CellButton onClick={connectWalletHandler} centered before={<Avatar src={metamaskLogo} size={24} />}>
                                Metamask
                            </CellButton>
                        </Card>
                    </CardGrid>
                </Group>
            </ModalPage>

            {/* liquidity */}
            <ModalPage
                id={modals[2]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Add liquidity</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <CardGrid size='l'>
                            <Card>
                                <FormItem
                                    top={
                                        <div className='flex-between'>
                                            <Paragraph size={14}>Add ArtemBonToken</Paragraph>
                                            {currentAccount != null &&
                                                <Paragraph size={14}>Balance: {userBalanceToken} Max</Paragraph>
                                            }
                                        </div>
                                    }
                                >
                                    <div className='flex-between'>
                                        <Cell
                                            style={{ fontSize: '18px' }}
                                            before={<Avatar src={tonLogo} size={40} />}
                                            after={<Icon16Dropdown />}
                                        >
                                            ARTT
                                        </Cell>
                                        <Input
                                            placeholder='0.0'
                                            value={tokenLiq}
                                            onChange={(e) => handleLiqInput(e.target.value)}
                                            onFocus={() => handleActiveInputLiq('token')}
                                            style={{ width: '70%' }}
                                            autoFocus
                                        />
                                    </div>
                                </FormItem>
                            </Card>


                            <Card>
                                <FormItem
                                    top={
                                        <div className='flex-between'>
                                            <Paragraph size={14}>Add Ethereum</Paragraph>
                                            {currentAccount != null &&
                                                <Paragraph size={14}>Balance: {userBalanceEth} Max</Paragraph>
                                            }
                                        </div>
                                    }
                                >
                                    <div className='flex-between'>
                                        <Cell
                                            style={{ fontSize: '18px' }}
                                            before={<Avatar src={btnLogo} size={40} />}
                                            after={<Icon16Dropdown />}
                                        >
                                            ETH
                                        </Cell>
                                        <Input
                                            placeholder='0.0'
                                            value={ethLiq}
                                            onChange={(e) => handleLiqInput(e.target.value)}
                                            onFocus={() => handleActiveInputLiq('eth')}
                                            style={{ width: '70%' }}
                                        />
                                    </div>
                                </FormItem>
                            </Card>
                        </CardGrid>

                        <Div />

                        <Button
                            size='l'
                            stretched
                            onClick={() => addLiquidity()}
                        >Add
                        </Button>
                    </Div>
                </Group>
            </ModalPage>

        </ModalRootFix>
    )

    return (
        <AppRoot>
            <SplitLayout
                style={{ justifyContent: 'center' }}
                header={<PanelHeader separator={false} />}
                modal={Modals}
            >
                <HeaderPanel
                    isDesktop={isDesktop}
                    isTablet={isTablet}
                    setModal={setModal}
                />

                <div className='main-block'>
                    {/* chart */}
                    {isDesktop &&
                        <SplitCol
                            animate={!isDesktop}
                            spaced={isDesktop}
                            width={isDesktop ? '800px' : '100%'}
                            maxWidth={isDesktop ? '800px' : '100%'}
                        >
                            <Panel>
                                <Group>
                                    <Div style={{ height: '40vh' }}>
                                    </Div>
                                </Group>
                            </Panel>
                        </SplitCol>
                    }

                    {/* exchange */}
                    <SplitCol
                        animate={!isDesktop}
                        spaced={isDesktop}
                        width={isDesktop ? '380px' : '480px'}
                        maxWidth={isDesktop ? '380px' : '480px'}
                    >
                        <ExchangePanel
                            setModal={setModal}
                            setTorSwap={setTorSwap}
                            torSwap={torSwap}
                            isDesktop={isDesktop}
                            isTablet={isTablet}
                            ethereum={ethereum}
                            getAccountWrapper={getAccountWrapper}
                            checkWalletIsConnected={checkWalletIsConnected}
                            connectWalletHandler={connectWalletHandler}
                            currentAccount={currentAccount}
                            toSwapInputHandler={toSwapInputHandler}
                            token={token}
                            eth={eth}
                            handleActiveInput={handleActiveInput}
                            activeInput={activeInput}
                            userBalanceEth={userBalanceEth}
                            userBalanceToken={userBalanceToken}
                            rateStr={rate}
                            update={() => update()}
                            addTokenToMetamask={() => addTokenToMetamask()}
                            swap={swap}
                            typeSwap={typeSwap}
                            changeTypeSwap={changeTypeSwap}
                        />
                    </SplitCol>
                </div>
            </SplitLayout>
        </AppRoot>

    );
}

export default App;