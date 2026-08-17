# Fix Hero Visual Container — Full-Size Rendering

Hãy kiểm tra và sửa **hero visual/hero animation ở phía bên phải của Hero Section**.

Hiện tại hero visual đang bị giới hạn bởi một container có `width` / `height` cố định, khiến animation/graphic bên phải nhìn bị nhỏ và có nhiều khoảng trống xung quanh.

## Mục tiêu

Hero visual phải **tận dụng tối đa toàn bộ không gian được phân bổ cho cột bên phải**, thay vì bị giới hạn bởi kích thước cố định.

### Yêu cầu

1. Kiểm tra toàn bộ component hero và tìm:

   * `width`
   * `height`
   * `max-width`
   * `max-height`
   * `aspect-ratio`
   * `overflow`
   * fixed pixel dimensions
   * wrapper/container đang giới hạn kích thước visual.

2. Loại bỏ các giới hạn kích thước không cần thiết.

3. Hero visual phải có khả năng:

```css
width: 100%;
height: 100%;
```

và parent container phải cho phép nó thực sự expand.

4. Nếu đang sử dụng Three.js / Canvas / WebGL:

   * Canvas phải resize theo kích thước thực tế của container.
   * Không hard-code canvas size.
   * Sử dụng `ResizeObserver` hoặc cơ chế tương đương để cập nhật:

     * width
     * height
     * camera aspect ratio
     * renderer size
     * pixel ratio.

5. Nếu visual đang dùng `<img>`:

   * Không dùng kích thước cố định khiến ảnh bị giới hạn.
   * Sử dụng `width: 100%` và `height: 100%`.
   * Điều chỉnh `object-fit` phù hợp.
   * Ưu tiên `object-fit: contain` nếu cần giữ toàn bộ hình.
   * Nếu design yêu cầu visual tràn rộng hơn container thì cho phép `object-fit: cover` hoặc scale phù hợp.

6. Nếu visual là SVG:

   * Kiểm tra `viewBox`.
   * Không để SVG bị giới hạn bởi width/height cố định.
   * Cho phép SVG scale theo parent.

## Layout Hero

Giữ nguyên layout 2 cột hiện tại:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│   HERO CONTENT                    HERO VISUAL        │
│   LEFT                            RIGHT              │
│                                                      │
│   Heading                         [FULL SIZE]        │
│   Description                                        │
│   Buttons                                             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Hero visual phải chiếm **toàn bộ available space của cột phải**.

Không làm thay đổi typography, màu sắc, nội dung hoặc bố cục bên trái.

## Quan trọng

Không chỉ tăng một giá trị `width` hoặc `height` một cách thủ công.

Hãy tìm **root cause** khiến visual bị giới hạn.

Kiểm tra cả parent containers vì trường hợp thường gặp là:

```css
.parent {
  width: 500px;
  height: 500px;
}

.visual {
  width: 100%;
  height: 100%;
}
```

Trong trường hợp này chỉ sửa `.visual` là chưa đủ.

Hãy đảm bảo toàn bộ hierarchy:

```text
Hero Section
   ↓
Hero Grid / Right Column
   ↓
Visual Wrapper
   ↓
Canvas / SVG / Image
```

đều có khả năng sử dụng available width/height.

## Responsive

Desktop:

* Visual lớn, tận dụng tối đa cột phải.
* Không bị giới hạn bởi fixed dimensions.

Tablet:

* Scale xuống tự nhiên.

Mobile:

* Hero chuyển thành layout một cột như hiện tại.
* Visual vẫn responsive.
* Không gây horizontal overflow.

## Không được làm

* Không thay đổi hero content.
* Không thay đổi text.
* Không thay đổi màu sắc.
* Không thay đổi animation concept.
* Không xóa animation hiện tại.
* Không thêm scrollbar ngang.
* Không dùng `width: 100vw` nếu nó gây overflow.
* Không dùng kích thước pixel cố định để "ép" visual lớn hơn.

Sau khi sửa, kiểm tra trên viewport desktop khoảng **1440×900** và các kích thước responsive phổ biến.

Mục tiêu cuối cùng:

**Hero visual phải visually fill toàn bộ vùng bên phải của Hero Section và không còn cảm giác bị nhốt trong một box nhỏ.**
