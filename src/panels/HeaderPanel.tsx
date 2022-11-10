import "@vkontakte/vkui/dist/vkui.css";
import { Button, ButtonGroup, CustomSelect, Div, IconButton, Panel, PanelHeader, Spacing, SplitCol, Tabbar, TabbarItem } from '@vkontakte/vkui';

import logoPNG from '../static/logo.png'
import { Icon16Dropdown, Icon16DropdownOutline, Icon24WalletOutline, Icon28CoinsOutline, Icon28DoorArrowLeftOutline, Icon28HomeOutline, Icon28MarketOutline, Icon28StatisticsOutline } from '@vkontakte/icons';

interface IMyProps {
    isDesktop: any,
    isTablet: any,
    setModal: Function
}

const HeaderPanel: React.FC<IMyProps> = (props: IMyProps) => {

    return (
        <>
            <SplitCol
                animate={!props.isDesktop}
                spaced={props.isDesktop}
                width={props.isDesktop ? '1210px' : '100%'}
                maxWidth={props.isDesktop ? '1210px' : '100%'}
                style={{ padding: '0px' }}
            >
                <Panel>
                    <PanelHeader
                        before={
                            <>
                                <Div>
                                    <img src={logoPNG} />
                                </Div>
                                {props.isDesktop && 
                                    <div className='logo-block'>
                                        <ButtonGroup
                                            mode='horizontal'
                                            gap='m'
                                            stretched
                                        >
                                            <Button size="l" appearance="accent" mode="tertiary">
                                                Main
                                            </Button>
                                            <Button size="l" appearance="accent" mode="tertiary">
                                                Dex
                                            </Button>
                                            <Button size="l" appearance="accent" mode="tertiary">
                                                NFT Marketplace
                                            </Button>
                                            <Button size="l" appearance="accent" mode="tertiary">
                                                NFT Earn
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                }
                            </>
                        }
                        after={
                            <>
                                {props.isTablet
                                    ? <div className='flex-between'>
                                        <Button
                                            size='l'
                                            mode="tertiary"
                                            style={{
                                                color: '#F16B16'
                                            }}
                                            >
                                            En
                                        </Button>
                                        <Button
                                            size="l"
                                            data-story="swap"
                                            before={<Icon28DoorArrowLeftOutline />}
                                            onClick={() => props.setModal('login')}
                                        >Connect wallet</Button>
                                    </div>
                                    : <div className='flex-between'>
                                        <Button
                                            size='m'
                                            mode="tertiary"
                                            style={{
                                                color: '#F16B16'
                                            }}
                                            >
                                            En
                                        </Button>
                                        <IconButton>
                                            <Icon24WalletOutline />
                                        </IconButton>
                                    </div>
                                }
                            </>
                        }
                    >
                        {!props.isDesktop &&
                            <>
                                <Spacing size={120} />
                                <Tabbar>
                                    <TabbarItem
                                        text="Main"
                                    >
                                        <Icon28HomeOutline />
                                    </TabbarItem>
                                    <TabbarItem
                                        text="Dex"
                                    >
                                        <Icon28StatisticsOutline />
                                    </TabbarItem>

                                    <TabbarItem
                                        text="NFT"
                                    >
                                        <Icon28MarketOutline />
                                    </TabbarItem>

                                    <TabbarItem
                                        text="Earn"
                                    >
                                        <Icon28CoinsOutline />
                                    </TabbarItem>
                                </Tabbar>
                            </>
                        }
                    </PanelHeader>
                </Panel>
            </SplitCol>
        </>
    )
}

export default HeaderPanel
