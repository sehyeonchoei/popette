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

// header
$(document).ready(function () {
    const $header = $('.header');

    $(window).on('scroll', function () {
        let currentScroll = $(window).scrollTop();
        let windowWidth = $(window).width();

        // 모바일(767px 이하)에서만 스크롤 위치에 따라 클래스 추가/제거
        if (windowWidth <= 767) {
            if (currentScroll > 880) {
                $header.addClass('scrolled');
            } else {
                $header.removeClass('scrolled');
            }
        } else {
            // PC 버전으로 돌아왔을 때 클래스 제거 (필요시)
            $header.removeClass('scrolled');
        }
    });
});


// flow
const wrapper = document.querySelector('.flow_wrapper');
const clone = wrapper.innerHTML;

// 콘텐츠를 한 번 더 추가하여 끊김 방지
wrapper.innerHTML += clone;

// 만약 텍스트가 짧아 화면이 빈다면 여러 번 복제 가능
wrapper.innerHTML += clone;


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
$(document).ready(function () {
    const itemsPerPage = 6; // 한 페이지당 아이템 수
    const $products = $('.product_item'); // 전체 상품 아이템
    const $pagination = $('.page_num'); // 페이지 번호 버튼들

    function showPage(pageNumber) {
        // 모든 상품  숨기기
        $products.hide();

        // 보여줄 인덱스 계산 (0부터 시작)
        // 1페이지: 0~5, 2페이지: 6~11 ...
        const start = (pageNumber - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // 해당 범위의 상품만 보이기
        $products.slice(start, end).fadeIn(300);

        // 페이지 번호 활성화 스타일 처리
        $pagination.removeClass('active');
        $pagination.eq(pageNumber - 1).addClass('active');
    }

    // 초기 실행: 1페이지 보여주기
    showPage(1);

    $pagination.on('click', function (e) {
        e.preventDefault();
        const targetPage = parseInt($(this).text());
        showPage(targetPage);

        // 1. 현재 화면 너비 확인
        const isMobile = window.innerWidth <= 767;
        let targetTop;

        if (isMobile) {
            // 2. 모바일: 가로 서브메뉴(All, Best...)가 가려지지 않게 여유 있게 이동
            // 서브메뉴가 포함된 컨테이너의 상단으로 이동하는 것이 좋습니다.
            targetTop = $('#product_list').offset().top - 48;
        } else {
            // 3. PC: 왼쪽 메뉴는 고정되어 있으므로, 제품 그리드의 시작점에 딱 맞춤
            targetTop = $('#product_list').offset().top - 0;
        }

        $('html, body').animate({ scrollTop: targetTop }, 500);
    });

    // Prev, Next 버튼
    $('.page_btn.prev').on('click', function (e) {
        e.preventDefault();
        const current = $('.page_num.active').text();
        if (current > 1) showPage(parseInt(current) - 1);
    });

    $('.page_btn.next').on('click', function (e) {
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


// 커서 변경
const canvas = document.getElementById('firework-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;

        this.opacity = 1;
        this.life = Math.random() * 0.02 + 0.015;
        this.size = Math.random() * 1 + 0.2;

        // 짧은 꼬리를 위한 히스토리
        this.trail = [];
        this.trailLength = 8;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        // 짧은 꼬리 그리기
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size * 1.3;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        // 입자
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        // 현재 위치를 히스토리에 추가
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += 0.12;
        this.opacity -= this.life;
    }
}

let particles = [];
const fireworkColors = ['#adddff', '#ffff76'];

function createFirework(x, y) {
    const count = 25;
    // 랜덤하게 두 색상 중 하나 선택
    const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('mousedown', (e) => {
    createFirework(e.clientX, e.clientY);
});

animate();