import React from 'react';
import './Sidebar.scss';
import logo from '../../SVG/Logo_MCR.svg';
import overviewIcon from '../../SVG/overview.svg';
import questionIcon from '../../SVG/question.svg';
import stakeIcon from '../../SVG/stake.svg';
import bookIcon from '../../SVG/book.svg';
import rocketIcon from '../../SVG/rocket.svg';
import peegIcon from '../../SVG/peeg.svg';

export default class Sidebar extends React.Component {

    constructor(props){
        super(props);

        this.changeSection = this.changeSection.bind(this);
    }

    changeSection = (e) => {
        // alert(e.target.className);
        // let exElem = document.querySelector('.active');
        // exElem.classList.toggle('.active');
        // let elem = document.querySelector(e.taget.className);
        // elem.classList.toggle('.active');
        // let elem = document.getElementsByClassName(e.target.className);
        // modal.classList.toggle('active');
    }

    render() {
        return(
            <nav>
                <img src={logo} />
                <aside>
                <div onClick={((e) => this.changeSection(e))} className='overview active'>
                    <span>
                        <img src={overviewIcon} />
                    </span>
                    <a>Overview</a>
                </div>
                <div onClick={((e) => this.changeSection(e))} className='howItWorks'>
                    <span>
                        <img src={questionIcon} />
                    </span>
                    <a>How it works</a>
                </div>
                <div onClick={((e) => this.changeSection(e))} className='bets'>
                    <span>
                        <img src={stakeIcon} />
                    </span>
                    <a>Bets</a>
                </div>
                <div onClick={((e) => this.changeSection(e))} className='docs'>
                    <span>
                        <img src={bookIcon} />
                    </span>
                    <a>Docs</a>
                </div>
                <div onClick={((e) => this.changeSection(e))} className='donats'>
                    <span>
                        <img src={rocketIcon} />
                    </span>
                    <a>Donats</a>
                </div>
                <div onClick={((e) => this.changeSection(e))} className='stake'>
                    <span>
                        <img src={peegIcon} />
                    </span>
                    <a>Stake</a>
                </div>
            </aside>
            </nav>
        );
    }
}