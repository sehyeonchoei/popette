// mainbanner 튕겨들어오는 o
if (window.innerWidth >= 1200) {
    gsap.from(".logo_o", {
        x: "120vw",
        duration: 3,
        ease: "power1.out",
        delay: 0.5
    });

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(".logo_o", {
        y: -250,
        duration: 0.45,
        ease: "power2.out"
    })
        .to(".logo_o", {
            y: 0,
            duration: 0.45,
            ease: "power2.in"
        })
        .to(".logo_o", {
            y: -230,
            duration: 0.5,
            ease: "power2.out"
        })
        .to(".logo_o", {
            y: 0,
            duration: 0.5,
            ease: "power2.in"
        })
        .to(".logo_o", {
            y: -90,
            duration: 0.35,
            ease: "power2.out"
        })
        .to(".logo_o", {
            y: 0,
            duration: 0.35,
            ease: "power2.in"
        })
        // 추가 통통 튀김
        .to(".logo_o", {
            y: -40,
            duration: 0.2,
            ease: "power2.out"
        })
        .to(".logo_o", {
            y: 0,
            duration: 0.2,
            ease: "power2.in"
        })
        .to(".logo_o", {
            y: -15,
            duration: 0.15,
            ease: "power2.out"
        })
        .to(".logo_o", {
            y: 0,
            duration: 0.15,
            ease: "bounce.out"  // 최종 안착
        });

    // 회전 (자연스러운 감속)
    gsap.from(".logo_o", {
        rotation: 1440,
        duration: 3,
        delay: 0.5
    });
}

// 모바일에서 header 스크롤 시 배경 변경
const header = document.querySelector('.header');

if (window.innerWidth <= 767 && header) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// has_submenu 클릭 토글
const hasSubmenu = document.querySelector('.has_submenu');
const shopLink = hasSubmenu.querySelector('a'); // SHOP 버튼

if (hasSubmenu) {
    hasSubmenu.addEventListener('click', function (e) {
        // 하위 메뉴 내부의 링크를 클릭했을 때는 닫히지 않게 전파 방지
        if (e.target.closest('.header_submenu')) {
            e.stopPropagation();
            return; 
        }

        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
    });

    // 바깥 영역 클릭 시 메뉴 닫기
    document.addEventListener('click', function () {
        hasSubmenu.classList.remove('active');
    });
}


// 추가 gnb
document.addEventListener('DOMContentLoaded', function () {
    const gnbItems = document.querySelectorAll('.gnb_item');
    const sectionTitle = document.querySelector('.section_title');

    gnbItems.forEach(item => {
        const header = item.querySelector('.gnb_header');
        const plusBtn = item.querySelector('.plus');

        // .gnb_header 또는 .plus 클릭 시 submenu 토글
        if (header) {
            header.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // 이벤트 전파 방지

                // .plus가 있는 경우만 토글 (submenu가 있는 경우)
                if (plusBtn) {
                    item.classList.toggle('active');
                }
            });
        }

        // Submenu item click
        const submenuItems = item.querySelectorAll('.submenu_item');
        submenuItems.forEach(submenuItem => {
            submenuItem.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // 이벤트 전파 방지

                // Remove 'on' class from all items
                submenuItems.forEach(si => si.classList.remove('on'));
                // Add 'on' class to clicked item
                this.classList.add('on');

                // Change section_title text
                if (sectionTitle) {
                    const selectedText = this.querySelector('a').textContent;
                    sectionTitle.textContent = selectedText;
                }
            });
        });
    });

    // 문서 전체 클릭 시 모든 submenu 닫기
    document.addEventListener('click', function () {
        gnbItems.forEach(item => {
            item.classList.remove('active');
        });
    });
});


// faq
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq_item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq_question');

        question.addEventListener('click', function () {
            // 클릭한 항목이 이미 열려있으면 닫기
            const isActive = item.classList.contains('active');

            // 모든 항목 닫기
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });

            // 클릭한 항목이 닫혀있었다면 열기
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});