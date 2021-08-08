window.addEventListener('DOMContentLoaded', () => {
    // Timer
    const timer = (idSelector, deadline) => {

        const getTimeRemaining = endTime => {
            const timeDifference = Date.parse(endTime) - Date.parse(new Date()),
                seconds = Math.floor((timeDifference / 1000) % 60),
                minutes = Math.floor((timeDifference / 1000 / 60) % 60),
                hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);

            return {
                'total': timeDifference,
                seconds,
                minutes,
                hours
            };
        };

        const addZero = num => {
            if (num >= 0 && num < 10) {
                return `0${num}`;
            } else {
                return num;
            }
        };

        const setClock = (selector, endTime) => {
            const timer = document.querySelector(selector),
                hours = timer.querySelector('#timer-hours'),
                minutes = timer.querySelector('#timer-minutes'),
                seconds = timer.querySelector('#timer-seconds'),
                timeInterval = setInterval(updateClock, 1000);

            updateClock(); // Stops blinking layout (Мигание верстки) when update the page

            function updateClock() {
                const remainingTime = getTimeRemaining(endTime);

                hours.textContent = addZero(remainingTime.hours);
                minutes.textContent = addZero(remainingTime.minutes);
                seconds.textContent = addZero(remainingTime.seconds);

                if (remainingTime.total <= 0) {
                    hours.textContent = '00';
                    minutes.textContent = '00';
                    seconds.textContent = '00';

                    clearInterval(timeInterval);
                }
            }
        };

        setClock(idSelector, deadline);
    };

    timer('#timer', '2021-08-29');

    // Menu
    const toggleMenu = (triggerSelector, menuSelector, closeBtnSelector, menuItemSelector, scrollBtnSelector) => {

        const trigger = document.querySelector(triggerSelector),
            menu = document.querySelector(menuSelector),
            closeBtn = document.querySelector(closeBtnSelector),
            menuItems = document.querySelectorAll(menuItemSelector),
            scrollBtn = document.querySelector(scrollBtnSelector);

        const handlerMenu = () => {
            menu.classList.toggle('active-menu');
        };

        trigger.addEventListener('click', handlerMenu);
        closeBtn.addEventListener('click', handlerMenu);

        let menuInterval;
        const menuAnimate = hash => {
            let count = 0;
            const menuClick = () => {
                menuInterval = requestAnimationFrame(menuClick);
                const x = 15;
                if (count < 825 && hash === '#service-block') {
                    scrollTo(0, count += x * 1.5);
                } else if (count < 2031 && hash === '#portfolio') {
                    scrollTo(0, count += x * 2.5);
                } else if (count < 3004.5 && hash === '#calc') {
                    scrollTo(0, count += x * 3.5);
                } else if (count < 4140 && hash === '#command') {
                    scrollTo(0, count += x * 4.5);
                } else if (count < 5046 && hash === '#connect') {
                    scrollTo(0, count += x * 5.5);
                } else cancelAnimationFrame(menuInterval);
            };

            menuClick();
        };

        scrollBtn.addEventListener('click', event => {
            console.dir(event.target);
            menuAnimate('#service-block');
        });

        menuItems.forEach(item => item.addEventListener('click', event => {
            menuAnimate(event.target.hash);
            handlerMenu();
        }));
    };

    toggleMenu('.menu', 'menu', '.close-btn', 'ul>li', 'a');

    //Modals
    const modals = (triggerBtnSelector, modalSelector, closeBtnSelector) => {
        const triggerBtn = document.querySelectorAll(triggerBtnSelector),
            modal = document.querySelector(modalSelector),
            closeBtn = document.querySelector(closeBtnSelector);

        const openModal = () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        function animate({
            timing,
            draw,
            duration
        }) {
            const start = performance.now();

            requestAnimationFrame(function animate(time) {
                // timeFraction изменяется от 0 до 1
                let timeFraction = (time - start) / duration;
                if (timeFraction > 1) {
                    timeFraction = 1;
                }

                // вычисление текущего состояния анимации
                const progress = timing(timeFraction);

                draw(progress); // отрисовать её

                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                }
            });
        }

        triggerBtn.forEach(trigger => {
            trigger.addEventListener('click', e => {
                if (e.target) {
                    e.preventDefault();
                }

                openModal();

                if (window.innerWidth > 768) {
                    animate({
                        duration: 500,
                        timing(timeFraction) {
                            return timeFraction;
                        },
                        draw(progress) {
                            modal.style.opacity = progress;
                        }
                    });
                    modal.style.visibility = 'visible';
                }
            });
        });

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', () => {
            document.body.style.overflow = '';
            if (window.innerWidth > 768) {
                window.setTimeout(() => modal.style.visibility = 'hidden', 500);
                animate({
                    duration: 500,
                    timing(timeFraction) {
                        return timeFraction;
                    },
                    draw(progress) {
                        modal.style.opacity = 1 - progress;
                    }
                });

            } else {
                closeModal();
            }
        });

        //При клике на подложку - исчезаeт.
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                closeModal();
            }
        });
    };

    modals('.popup-btn', '.popup', '.popup-close');

});