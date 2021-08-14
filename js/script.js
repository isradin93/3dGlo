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
    const toggleMenu = () => {
        const menu = document.querySelector('menu'),
            closeBtn = document.querySelector('.close-btn');

        const handlerMenu = () => {
            menu.classList.toggle('active-menu');
        };

        document.addEventListener('click', event => {
            const target = event.target;

            if (target === closeBtn || target.closest('menu>ul')) {
                handlerMenu();
            } else if (target.closest('.menu')) {
                handlerMenu();
            } else if (target !== menu) {
                menu.classList.remove('active-menu');
            }
        });
    };

    toggleMenu();

    //Modals
    const modals = (triggerBtnSelector, modalSelector, modalContentSelector, closeBtnSelector) => {
        const triggerBtn = document.querySelectorAll(triggerBtnSelector),
            modal = document.querySelector(modalSelector),
            modalContent = document.querySelector(modalContentSelector),
            closeBtn = document.querySelector(closeBtnSelector);

        const openModal = () => {
            modal.style.display = 'block';
            modalContent.style.position.left = '50%';
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
            modalContent.style.position.left = '-50%';
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

    modals('.popup-btn', '.popup', '.popup-content', '.popup-close');

    // Tabs
    const tabs = (headerSelector, tabSelector, contentSelector, activeClass) => {
        const tabHeader = document.querySelector(headerSelector),
            tabs = document.querySelectorAll(tabSelector),
            tabContents = document.querySelectorAll(contentSelector);

        const hideTabContent = () => {
            tabContents.forEach(tabContent => tabContent.style.display = 'none');

            tabs.forEach(tab => tab.classList.remove(activeClass));
        };

        const showTabContent = (i = 0) => {
            tabContents[i].style.display = 'flex';
            tabs[i].classList.add(activeClass);
        };

        hideTabContent();
        showTabContent();

        tabHeader.addEventListener('click', e => {
            const target = e.target;

            if (target && target.classList.contains(tabSelector.replace(/\./, '')) ||
                target.parentNode.classList.contains(tabSelector.replace(/\./, ''))) {
                tabs.forEach((tab, i) => {
                    if (target === tab || target.parentNode === tab) {
                        hideTabContent();
                        showTabContent(i);
                    }
                });
            }
        });
    };

    tabs('.service-header', '.service-header-tab', '.service-tab', 'active');

    const slider = () => {
        const slide = document.querySelectorAll('.portfolio-item'),
            slider = document.querySelector('.portfolio-content'),
            allDots = document.querySelector('.portfolio-dots');

        let currentSlide = 0,
            interval;

        const addDots = () => {
            slide.forEach(() => {
                const li = document.createElement('li');
                li.classList.add('dot');
                allDots.append(li);
            });
        };

        addDots();

        const dot = document.querySelectorAll('.dot');

        const prevSlide = (element, index, strClass) => {
            element[index].classList.remove(strClass);
        };

        const nextSlide = (element, index, strClass) => {
            element[index].classList.add(strClass);
        };

        const autoPlaySlide = () => {
            prevSlide(slide, currentSlide, 'portfolio-item-active');
            prevSlide(dot, currentSlide, 'dot-active');
            currentSlide++;

            if (currentSlide >= slide.length) {
                currentSlide = 0;
            }

            nextSlide(slide, currentSlide, 'portfolio-item-active');
            nextSlide(dot, currentSlide, 'dot-active');
        };

        const startSlide = (time = 3000) => {
            interval = setInterval(autoPlaySlide, time);
        };

        const stopSlide = () => {
            clearInterval(interval);
        };

        // Переключение слайдов по нажатию кнопки или точки
        slider.addEventListener('click', event => {
            event.preventDefault();
            const target = event.target;

            if (!target.matches('.portfolio-btn, .dot')) {
                return;
            }

            prevSlide(slide, currentSlide, 'portfolio-item-active');
            prevSlide(dot, currentSlide, 'dot-active');

            if (target.matches('#arrow-right')) {
                currentSlide++;
            } else if (target.matches('#arrow-left')) {
                currentSlide--;
            } else if (target.matches('.dot')) {
                dot.forEach((elem, index) => {
                    if (elem === target) {
                        currentSlide = index;
                    }
                });
            }

            if (currentSlide >= slide.length) {
                currentSlide = 0;
            }

            if (currentSlide < 0) {
                currentSlide = slide.length - 1;
            }

            nextSlide(slide, currentSlide, 'portfolio-item-active');
            nextSlide(dot, currentSlide, 'dot-active');
        });

        slider.addEventListener('mouseover', event => {
            if (event.target.matches('.portfolio-btn') ||
                event.target.matches('.dot')) {
                stopSlide();
            }
        });

        slider.addEventListener('mouseout', event => {
            if (event.target.matches('.portfolio-btn') ||
                event.target.matches('.dot')) {
                startSlide();
            }
        });
        startSlide(1500);
    };

    slider();

    // Change image
    const changeImage = () => {
        const commandPhoto = document.querySelectorAll('.command__photo');

        commandPhoto.forEach(photo => {
            photo.addEventListener('mouseover', event => {
                [event.target.src, event.target.dataset.img] = [event.target.dataset.img, event.target.src];
            });
        });

        commandPhoto.forEach(photo => {
            photo.addEventListener('mouseout', event => {
                [event.target.dataset.img, event.target.src] = [event.target.src, event.target.dataset.img];
            });
        });
    };

    changeImage();

    // Regexp
    const regexpInput = () => {
        const calcItems = document.querySelectorAll('.calc-item'),
            formName1 = document.getElementById('form1-name'),
            formName2 = document.getElementById('form2-name'),
            formName3 = document.getElementById('form3-name'),
            formMail1 = document.getElementById('form1-email'),
            formMail2 = document.getElementById('form2-email'),
            formMail3 = document.getElementById('form3-email'),
            formPhone1 = document.getElementById('form1-phone'),
            formPhone2 = document.getElementById('form2-phone'),
            formPhone3 = document.getElementById('form3-phone'),
            formMessage = document.getElementById('form2-message');

        const limitationElems = (elem, regExp) => {
            elem.addEventListener('keypress', e => {
                if (!e.key.match(regExp)) {
                    e.preventDefault();
                }
            });

            elem.addEventListener('blur', e => {
                let elemValue = e.target.value;
                elemValue = elemValue.replace(/\s+/g, ' ');
                elemValue = elemValue.replace(/-+/g, '-');
                elemValue = elemValue.trim().split('');

                while (elemValue[0] === '-') {
                    elemValue.shift();
                }

                while (elemValue[elemValue.length - 1] === '-') {
                    elemValue.pop();
                }

                e.target.value = elemValue.filter(el => el.match(regExp)).join('');

                if (e.target === formName1 || e.target === formName2 || e.target === formName3) {
                    let nameRepair = e.target.value.trim().split(' ');

                    if (nameRepair.length > 1) {
                        nameRepair = nameRepair.map(el => el.slice(0, 1).toUpperCase() + el.slice(1).toLowerCase());
                        e.target.value = nameRepair.join(' ');
                    } else {
                        nameRepair = nameRepair.toString().slice(0, 1).toUpperCase() +
                            nameRepair.toString().slice(1).toLowerCase();
                        e.target.value = nameRepair;
                    }
                }
            });
        };

        calcItems.forEach(elem => limitationElems(elem, /[0-9]/g));

        limitationElems(formName1, /[а-яА-Я\s-]/g);
        limitationElems(formName2, /[а-яА-Я\s-]/g);
        limitationElems(formName3, /[а-яА-Я\s-]/g);
        limitationElems(formMail1, /[a-zA-Z@_.!~*'-]/g);
        limitationElems(formMail2, /[a-zA-Z@_.!~*'-]/g);
        limitationElems(formMail3, /[a-zA-Z@_.!~*'-]/g);
        limitationElems(formPhone1, /[0-9()+-]/g);
        limitationElems(formPhone2, /[0-9()+-]/g);
        limitationElems(formPhone3, /[0-9()+-]/g);
        limitationElems(formMessage, /[а-яА-Я\s-]/g);
    };

    regexpInput();
});