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

// mobile에서 스크롤 시 header 변경
$(document).ready(function() {
    const $header = $('.header');
    const $hasSubmenu = $('.has_submenu');

    $(window).on('scroll', function() {
        let currentScroll = $(window).scrollTop();
        let windowWidth = $(window).width();

        // 1. 특정 높이(500px) 이하로 올라가면 서브메뉴 닫기
        // 오타 수정: rmoveClass -> removeClass
        if (currentScroll <= 880) { 
            $hasSubmenu.removeClass('active');
        }

        // 2. 모바일(767px 이하) 헤더 배경 변경 로직
        if (windowWidth <= 767) {
            if (currentScroll > 300) {
                $header.addClass('scrolled');
            } else {
                $header.removeClass('scrolled');
            }
        }
    });
});

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


// submenu on
$(document).ready(function() {
    // 서브메뉴 내부의 a 태그 클릭 시
    $('.header_submenu_item a').on('click', function() {
        // 모든 서브메뉴 링크에서 'on' 클래스 제거
        $('.header_submenu_item a').removeClass('on');
        
        // 방금 클릭한 요소에만 'on' 클래스 추가
        $(this).addClass('on');
        
        // (참고) 만약 클릭 시 바로 페이지가 이동된다면, 
        // 새 페이지가 로드될 때 이 클래스가 초기화될 수 있습니다.
        // 현재는 한 페이지 내에서 동작하는 경우를 가정합니다.
    });
});


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

// pagination
$(document).ready(function() {
    const itemsPerPage = 6; // 한 페이지당 아이템 수
    const $products = $('.product_item'); // 전체 상품 아이템
    const $pagination = $('.page_num'); // 페이지 번호 버튼들

    function showPage(pageNumber) {
        // 1. 모든 상품 일단 숨기기
        $products.hide();

        // 2. 보여줄 인덱스 계산 (0부터 시작)
        // 1페이지: 0~5, 2페이지: 6~11 ...
        const start = (pageNumber - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // 3. 해당 범위의 상품만 보이기
        $products.slice(start, end).fadeIn(300);

        // 4. 페이지 번호 활성화 스타일 처리
        $pagination.removeClass('active');
        $pagination.eq(pageNumber - 1).addClass('active');
    }

    // 초기 실행: 1페이지 보여주기
    showPage(1);

    // 페이지 번호 클릭 이벤트
    $pagination.on('click', function(e) {
        e.preventDefault();
        const targetPage = parseInt($(this).text());
        showPage(targetPage);
        
        // 클릭 시 상단으로 부드럽게 이동 (선택 사항)
        $('html, body').animate({ scrollTop: $('#product_list').offset().top - 100 }, 500);
    });

    // Prev, Next 버튼 로직 (추가 구현 가능)
    $('.page_btn.prev').on('click', function(e) {
        e.preventDefault();
        const current = $('.page_num.active').text();
        if (current > 1) showPage(parseInt(current) - 1);
    });

    $('.page_btn.next').on('click', function(e) {
        e.preventDefault();
        const current = $('.page_num.active').text();
        if (current < $pagination.length) showPage(parseInt(current) + 1);
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