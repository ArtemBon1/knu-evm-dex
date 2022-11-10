import "@vkontakte/vkui/dist/vkui.css";

import { Avatar, Button, Card, CardGrid, Cell, Div, FormItem, Group, IconButton, Input, Paragraph, Slider, Spacing, Title } from '@vkontakte/vkui';
import { Icon16Dropdown, Icon24AddCircleOutline, Icon24Arrow2SquarepathOutline, Icon24Filter, Icon24GraphOutline, Icon24RefreshOutline, Icon24WalletOutline, Icon28SortOutline } from '@vkontakte/icons';

import tonLogo from '../static/ton-logo.png';
import btnLogo from '../static/btn-logo.png';
import { InputMask } from '../components/InputMask';
import React from "react";


interface IMyProps {
    setModal: Function,
    setTorSwap: Function,
    torSwap: string,
    isDesktop: any,
    isTablet: any,
    ethereum: any,
    getAccountWrapper: Function,
    checkWalletIsConnected: Function,
    connectWalletHandler: any,
    currentAccount: any,
    toSwapInputHandler: any,
    token: string,
    eth: string,
    handleActiveInput: Function,
    activeInput: string,
    userBalanceEth: string,
    userBalanceToken: string,
    rateStr: string,
    update: Function,
    addTokenToMetamask: Function,
    swap: Function,
    typeSwap: boolean,
    changeTypeSwap: Function
}

const ExchangePanel: React.FC<IMyProps> = (props: IMyProps) => {

    return (
        <Group>
            <Div>
                <Div>
                    <Cell
                        disabled
                        before={
                            <div>
                                <Title width='3' level='1'>Swap</Title>
                                <small>Trade tokens in an instant</small>
                            </div>
                        }
                        after={
                            <>
                                { props.isDesktop
                                    ? <IconButton
                                        style={{ marginRight: '5px' }}
                                        onClick={(e) => props.update()}
                                      >
                                        <Icon24RefreshOutline />
                                    </IconButton>
                                    : <IconButton
                                        onClick={() => props.setModal('graph')}
                                        style={{ marginRight: '5px' }}
                                    >
                                        <Icon24GraphOutline />
                                    </IconButton>
                                }
                                <IconButton
                                    onClick={(e) => props.addTokenToMetamask()}
                                >
                                    <Icon24Filter />
                                </IconButton>
                            </>
                        }
                    />
                </Div>

                {props.isDesktop ? <Spacing size={32} /> : <Spacing size={20} />}

                <CardGrid size='l'>
                    <Card>
                        { props.typeSwap
                            ? <FormItem
                                top={
                                    <div className='flex-between'>
                                        <Paragraph size={14}>From</Paragraph>
                                        { props.currentAccount != null &&
                                            <Paragraph size={14}>Balance: {props.userBalanceToken} Max</Paragraph>
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
                                    { props.activeInput == 'token'
                                        ? <InputMask
                                            mask={Number}
                                            radix='.'
                                            scale={9}
                                            min={0}
                                            max={10000}
                                            placeholder='0.0'
                                            value={props.token}
                                            onAccept={props.toSwapInputHandler}
                                            style={{ width: '60%' }}
                                            autoFocus
                                        />
                                        : <Input
                                            placeholder='0.0'
                                            value={props.token}
                                            onFocus={() => props.handleActiveInput('token')}
                                            onChange={() => { }}
                                        />
                                    }
                                </div>
                            </FormItem>

                            : <FormItem
                                top={
                                    <div className='flex-between'>
                                        <Paragraph size={14}>From</Paragraph>
                                        { props.currentAccount != null &&
                                            <Paragraph size={14}>Balance: {props.userBalanceEth} Max</Paragraph>
                                        }
                                    </div>
                                }
                            >
                                <div className='flex-between'>
                                    <Cell
                                        style={{ fontSize: '18px' }}
                                        before={<Avatar src={btnLogo} size={40} style={{ background: 'none' }} />}
                                        after={<Icon16Dropdown />}
                                    >
                                        ETH
                                    </Cell>
                                    { props.activeInput == 'eth'
                                        ? <InputMask
                                            mask={Number}
                                            radix='.'
                                            scale={9}
                                            min={0}
                                            max={10000}
                                            placeholder='0.0'
                                            onAccept={props.toSwapInputHandler}
                                            value={props.eth}
                                            style={{ width: '60%' }}
                                            autoFocus
                                        />
                                        : <Input
                                            placeholder='0.0'
                                            value={props.eth}
                                            onFocus={() => props.handleActiveInput('eth')}
                                            onChange={() => { }}
                                        />
                                    }

                                </div>
                            </FormItem>
                        }
                    </Card>

                    <Div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'var(--accent)',
                        width: '100%'
                    }}>
                        <IconButton
                            style={{
                                borderRadius: '50%',
                                background: '#2D2D37'
                            }}
                            onClick={() => props.changeTypeSwap()}
                        >
                            <Icon28SortOutline />
                        </IconButton>
                    </Div>

                    <Card style={{ marginTop: '0px' }}>
                        { props.typeSwap
                            ? <FormItem
                                top={
                                    <div className='flex-between'>
                                        <Paragraph size={14}>To</Paragraph>
                                        { props.currentAccount != null &&
                                            <Paragraph size={14}>Balance: {props.userBalanceEth} Max</Paragraph>
                                        }
                                    </div>
                                }
                            >
                                <div className='flex-between'>
                                    <Cell
                                        style={{ fontSize: '18px' }}
                                        before={<Avatar src={btnLogo} size={40} style={{ background: 'none' }} />}
                                        after={<Icon16Dropdown />}
                                    >
                                        ETH
                                    </Cell>
                                    { props.activeInput == 'eth'
                                        ? <InputMask
                                            mask={Number}
                                            radix='.'
                                            scale={9}
                                            min={0}
                                            max={10000}
                                            placeholder='0.0'
                                            onAccept={props.toSwapInputHandler}
                                            value={props.eth}
                                            style={{ width: '60%' }}
                                            autoFocus
                                        />
                                        : <Input
                                            placeholder='0.0'
                                            value={props.eth}
                                            onFocus={() => props.handleActiveInput('eth')}
                                            onChange={() => { }}
                                        />
                                    }

                                </div>
                            </FormItem>

                            : <FormItem
                                top={
                                    <div className='flex-between'>
                                        <Paragraph size={14}>To</Paragraph>
                                        { props.currentAccount != null &&
                                            <Paragraph size={14}>Balance: {props.userBalanceToken} Max</Paragraph>
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
                                    { props.activeInput == 'token'
                                        ? <InputMask
                                            mask={Number}
                                            radix='.'
                                            scale={9}
                                            min={0}
                                            max={10000}
                                            placeholder='0.0'
                                            value={props.token}
                                            onAccept={props.toSwapInputHandler}
                                            style={{ width: '60%' }}
                                            autoFocus
                                        />
                                        : <Input
                                            placeholder='0.0'
                                            value={props.token}
                                            onFocus={() => props.handleActiveInput('token')}
                                            onChange={() => { }}
                                        />
                                    }
                                </div>
                            </FormItem>
                        }

                    </Card>
                </CardGrid>

                {props.isDesktop && <Spacing size={16} />}

                <Div>
                    <div className='flex-between'>
                        <small>Price</small>
                        <div className='flex-between'>
                            <small style={{ marginRight: '5px' }}>{props.rateStr}</small>
                            { !props.isDesktop &&
                                <IconButton>
                                    <Icon24RefreshOutline />
                                </IconButton>
                            }
                        </div>
                    </div>
                </Div>

                {props.isDesktop && <Spacing size={20} />}

                <FormItem top={
                    <div className='flex-between'>
                        <small>Slippage Tolerance</small>
                        <small>{props.torSwap}%</small>
                    </div>
                }>
                    <Spacing size={10} />
                    <Slider
                        step={1}
                        min={1}
                        max={20}
                        value={Number(props.torSwap)}
                        onChange={value => props.setTorSwap(value)}
                    />
                </FormItem>

                <Spacing size={20} />

                <Div>
                    { props.currentAccount != null
                        ? <Button
                            size="l"
                            stretched
                            before={<Icon24Arrow2SquarepathOutline />}
                            onClick={(e) => props.swap()}
                        >
                            Exchange
                        </Button>

                        : <Button
                            size="l"
                            stretched
                            before={<Icon24WalletOutline />}
                            onClick={() => props.setModal('login')}
                        >
                            Connect wallet
                        </Button>
                    }
                </Div>
                <Div>
                    <Button
                        size="l"
                        stretched
                        mode='secondary'
                        before={<Icon24AddCircleOutline />}
                        onClick={() => props.setModal('liquidity')}
                    >
                        Add liquidity
                    </Button>
                </Div>
            </Div>
        </Group>
    )
}

export default ExchangePanel