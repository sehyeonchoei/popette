// [1] 새로고침 시 스크롤 위치 및 해시 제어
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// URL에 #이 붙어 있다면 제거 (새로고침 시에만 동작)
$(document).ready(function () {
    // 페이지 로드 시 한 번만 실행
    if (window.location.hash) {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
    }

    // 페이지 로딩 즉시 최상단 강제 고정
    window.scrollTo(0, 0);
    $('html, body').scrollTop(0);
});

// [2] 모든 # 앵커 클릭 시 부드러운 스크롤
$(document).on('click', 'a[href^="#"]', function (e) {
    const $this = $(this);
    
    // 서브메뉴, pagination, gnb_header의 링크는 완전 제외
    if ($this.closest('.submenu_item').length > 0 || 
        $this.closest('.pagination').length > 0 ||
        $this.closest('.gnb_header').length > 0) {
        return;
    }
    
    e.preventDefault();

    const target = $(this.hash);
    const duration = 800;

    if (target.length) {
        $('html, body').stop().animate({
            scrollTop: target.offset().top - 0
        }, duration);
    }
});

// [3] 메인배너 로고 GSAP 애니메이션 (PC 전용)
if (window.innerWidth >= 1200) {
    // 가로 스크롤 생김 방지
    $('body').css('overflow-x', 'hidden');

    // 오른쪽에서 날아오기
    gsap.from(".logo_o", {
        x: "100vw",
        duration: 3,
        ease: "power1.out",
        delay: 0.5
    });

    // 위아래로 통통 튀는 타임라인
    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(".logo_o", { y: -250, duration: 0.45, ease: "power2.out" })
        .to(".logo_o", { y: 0, duration: 0.45, ease: "power2.in" })
        .to(".logo_o", { y: -230, duration: 0.5, ease: "power2.out" })
        .to(".logo_o", { y: 0, duration: 0.5, ease: "power2.in" })
        .to(".logo_o", { y: -90, duration: 0.35, ease: "power2.out" })
        .to(".logo_o", { y: 0, duration: 0.35, ease: "power2.in" })
        .to(".logo_o", { y: -40, duration: 0.2, ease: "power2.out" })
        .to(".logo_o", { y: 0, duration: 0.2, ease: "power2.in" })
        .to(".logo_o", { y: -15, duration: 0.15, ease: "power2.out" })
        .to(".logo_o", { y: 0, duration: 0.15, ease: "bounce.out" });

    // 회전 효과
    gsap.from(".logo_o", {
        rotation: 1440,
        duration: 3,
        delay: 0.5
    });
}


// [4] 모바일 헤더 스크롤 클래스 토글
$(document).ready(function () {
    const $header = $('.header');

    $(window).on('scroll', function () {
        let currentScroll = $(window).scrollTop();
        let windowWidth = $(window).width();

        if (windowWidth <= 767) {
            // 880px 지점을 기준으로 변화 (숫자 수정 가능)
            if (currentScroll > 880) {
                $header.addClass('scrolled');
            } else {
                $header.removeClass('scrolled');
            }
        } else {
            $header.removeClass('scrolled');
        }
    });
});


// [5] 텍스트 흐름(Flow) 무한 복제 로직
(function () {
    const wrapper = document.querySelector('.flow_wrapper');
    if (wrapper) {
        const clone = wrapper.innerHTML;
        wrapper.innerHTML += clone;
        wrapper.innerHTML += clone; // 총 3배로 복제하여 빈 공간 방지
    }
})();



// [6-1] GNB 메뉴 제어 및 페이지 화살표 버튼
$(document).ready(function () {
    const $gnbItems = $('.gnb_item');

    // GNB 서브메뉴 토글
    $('.gnb_header, .plus').on('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        const $parent = $(this).closest('.gnb_item');
        $gnbItems.not($parent).removeClass('active');
        $parent.toggleClass('active');
    });

    // 이전 버튼
    $('.page_btn.prev').on('click', function (e) {
        e.preventDefault();
        const current = parseInt($('.page_num.active').text());
        if (current > 1) $('.page_num').eq(current - 2).trigger('click');
    });

    // 다음 버튼
    $('.page_btn.next').on('click', function (e) {
        e.preventDefault();
        const current = parseInt($('.page_num.active').text());
        if (current < window.totalPages) $('.page_num').eq(current).trigger('click');
    });

    // 외부 클릭 시 GNB 닫기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.gnb_item').length) $gnbItems.removeClass('active');
    });
});

// [6-2] 카테고리 필터링 및 클릭 이동
$(document).ready(function () {
    const $allProducts = $('.product_item').not('.dummy');
    const $sectionTitle = $('.section_title');
    const scrollSpeed = 600;
    const pcMargin = 30;
    const mobileMargin = 20;

    window.currentFilteredItems = [];

    $('.submenu_item a').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const selectedCategory = $(this).text().trim();
        $('.submenu_item').removeClass('on');
        $(this).parent().addClass('on');
        $sectionTitle.text(selectedCategory);

        // 필터링 로직
        if (selectedCategory.toUpperCase() === 'ALL') {
            window.currentFilteredItems = $allProducts.toArray();
        } else {
            window.currentFilteredItems = $allProducts.filter(function () {
                const itemCat = ($(this).attr('data-category') || "").toUpperCase();
                return itemCat.includes(selectedCategory.toUpperCase());
            }).toArray();
        }

        // ★ 페이지네이션과 showPage를 '조용히' 실행 (스크롤 보존 모드)
        window.isQuietUpdate = true; // 플래그 설정
        window.totalPages = window.createPagination(window.currentFilteredItems);
        window.showPage(1, window.currentFilteredItems);
        window.isQuietUpdate = false; // 플래그 해제
        
        // 리스트 상단으로 스르륵 (초기 로드 제외)
        if (!window.isInitialLoad) {
            const $target = $('#product_list');
            if ($target.length) {
                const isMobile = window.innerWidth <= 767;
                const targetScroll = $target.offset().top - (isMobile ? mobileMargin : pcMargin);
                
                // ★ 즉시 애니메이션 시작 (딜레이 없음)
                $('html, body').stop(true, true).animate({
                    scrollTop: targetScroll
                }, scrollSpeed);
            }
        }
        
        return false;
    });

    // 초기 실행 (ALL 자동 클릭)
    $('.submenu_item a').filter(function () {
        return $(this).text().trim().toUpperCase() === 'ALL';
    }).first().trigger('click');
});

// [6-3] 제품 리스트 기초 설정 및 격자 보정
$(document).ready(function () {
    const $allProducts = $('.product_item').not('.dummy');
    const itemsPerPage = 6; // 한 페이지당 보여줄 제품 수

    // 반응형 격자 테두리 및 더미 데이터 처리
    function refreshBorders() {
        $('.product_item.dummy').remove();
        $('.product_item').removeClass('no-right-border');

        // PC는 3열, 태블릿/모바일은 2열 기준
        const cols = ($(window).width() <= 1199) ? 2 : 3;
        const $visibleItems = $('.product_item:visible').not('.dummy');

        if ($visibleItems.length % cols !== 0) {
            const need = cols - ($visibleItems.length % cols);
            for (let i = 0; i < need; i++) {
                $('.product_grid').append('<li class="product_item dummy"></li>');
            }
        }
        $('.product_item:visible').each(function (index) {
            if ((index + 1) % cols === 0) $(this).addClass('no-right-border');
        });
    }

    $(window).on('resize', refreshBorders);
    // 다른 섹션에서 쓸 수 있게 전역 함수화 (필요시)
    window.refreshBorders = refreshBorders;
});

// [6-4] 페이지네이션 UI 및 이동 제어
$(document).ready(function () {
    const $pageNumbersContainer = $('.page_numbers');
    const $allProducts = $('.product_item').not('.dummy');
    const itemsPerPage = 6;
    const scrollSpeed = 600;

    // 페이지 번호 생성
    window.createPagination = function (filteredItems) {
        const savedScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        $pageNumbersContainer.empty();
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

        if (totalPages <= 1) { 
            $('.pagination').hide();
            if (window.isQuietUpdate) {
                window.scrollTo(0, savedScroll);
            }
            return totalPages; 
        }

        $('.pagination').show();
        
        const fragment = document.createDocumentFragment();
        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement('a');
            link.href = 'javascript:void(0);';
            link.className = 'page_num';
            link.textContent = i;
            link.tabIndex = -1;
            fragment.appendChild(link);
        }
        $pageNumbersContainer[0].appendChild(fragment);
        
        if (window.isQuietUpdate) {
            window.scrollTo(0, savedScroll);
        }
        
        return totalPages;
    };

    // 실제 페이지 출력 함수
    window.showPage = function (pageNumber, filteredItems) {
        const savedScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // ★ 개선: display: none으로 깔끔하게 숨기기
        $allProducts.hide();
        
        const start = (pageNumber - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // ★ 선택된 아이템만 표시
        $(filteredItems).slice(start, end).show();
        
        $('.page_num').removeClass('active').eq(pageNumber - 1).addClass('active');

        if (window.refreshBorders) window.refreshBorders();
        
        if (window.isQuietUpdate) {
            window.scrollTo(0, savedScroll);
        }
    };

    // 페이지 번호 클릭 이벤트
    $(document).on('click', '.page_num', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const targetPage = parseInt($(this).text());
        window.showPage(targetPage, window.currentFilteredItems);

        const isMobile = window.innerWidth <= 767;
        $('html, body').stop(true, true).animate({
            scrollTop: $('#product_list').offset().top - (isMobile ? 48 : 60)
        }, scrollSpeed);
        
        return false;
    });
});

// [6-5] 페이지 로드 시 ALL 카테고리 자동 실행
$(document).ready(function () {
    // 로딩 시점에 플래그 설정 (첫 클릭 시 스크롤 방지용)
    window.isInitialLoad = true;

    setTimeout(function () {
        $('.submenu_item a').filter(function () {
            return $(this).text().trim().toUpperCase() === 'ALL';
        }).first().trigger('click');

        // 데이터 로딩 후 다시 한 번 최상단 고정
        window.scrollTo(0, 0);

        // 초기 로딩 완료 후 플래그 해제 (이후 클릭부터는 스크롤 작동)
        window.isInitialLoad = false;
    }, 50); // 시간을 조금 줄여서 더 빠르게 실행
});



// [7] 마우스 클릭 불꽃놀이(Firework) 효과
(function () {
    const canvas = document.getElementById('firework-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 4 + 1;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            this.opacity = 1;
            this.life = Math.random() * 0.02 + 0.015;
            this.size = Math.random() * 1 + 0.2;
            this.trail = [];
            this.trailLength = 8;
        }

        draw() {
            ctx.save(); ctx.globalAlpha = this.opacity;
            if (this.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                for (let i = 1; i < this.trail.length; i++) ctx.lineTo(this.trail[i].x, this.trail[i].y);
                ctx.strokeStyle = this.color; ctx.lineWidth = this.size * 1.3; ctx.lineCap = 'round'; ctx.stroke();
            }
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
        }

        update() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.trailLength) this.trail.shift();
            this.x += this.vx; this.y += this.vy;
            this.vx *= 0.96; this.vy *= 0.96; this.vy += 0.12;
            this.opacity -= this.life;
        }
    }

    let particles = [];
    const fireworkColors = ['#adddff'];

    function createFirework(x, y) {
        const count = 25;
        const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        for (let i = 0; i < count; i++) particles.push(new Particle(x, y, color));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.opacity > 0);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('mousedown', (e) => createFirework(e.clientX, e.clientY));
    animate();
})();

// [8] top btn
// JavaScript: 스크롤 동작 제어
 const topBtn = document.getElementById("topBtn");

function scrollFunction() {
    // 현재 스크롤 위치 확인
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    
    if (scrollTop > 500) {
        topBtn.style.display = "flex"; // block 대신 flex로 변경 (중앙정렬 유지)
    } else {
        topBtn.style.display = "none";
    }
}

// 1. 사용자가 스크롤을 할 때 실행
window.onscroll = function() {
    scrollFunction();
};

// 2. [추가] 새로고침 시 페이지 로드가 완료되었을 때 실행
window.onload = function() {
    scrollFunction();
};

// 버튼 클릭 시 최상단으로 이동
topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});