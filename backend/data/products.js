const products = [
    {
      name: "Nike Air Max 270",
      description: "Giày thể thao Nike Air Max 270 với công nghệ đệm khí mới nhất, phù hợp cho chạy bộ và tập luyện hàng ngày.",
      price: 3200000,
      discountPrice: 2900000,
      countInStock: 50,
      sku: "NK-AM270-BLK-42",
      category: "Giày thể thao",
      brand: "Nike",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Đen",
      collection: "Air Max",
      material: "Vải dệt, da tổng hợp",
      gender: "Men",
      images: [
        {
          url: "https://example.com/images/nike-air-max-270-1.jpg",
          altText: "Nike Air Max 270 - Góc nhìn chính"
        },
        {
          url: "https://example.com/images/nike-air-max-270-2.jpg",
          altText: "Nike Air Max 270 - Góc nhìn bên"
        }
      ],
      isFeatured: true,
      isPublished: true,
      rating: 4.5,
      numReviews: 120,
      tags: ["Nike", "Air Max", "Sneakers", "Running"],
      metaTitle: "Nike Air Max 270 - Giày thể thao chất lượng cao",
      metaDescription: "Mua Nike Air Max 270 chính hãng với đệm Air cải tiến mới nhất, thiết kế hiện đại và thoải mái cho mọi hoạt động.",
      metaKeywords: ["Nike", "Air Max 270", "giày thể thao", "giày chạy bộ"],
      dimensions: {
        length: 30,
        width: 12,
        height: 15,
        weight: 0.35
      }
    },
    {
      name: "Adidas Ultraboost 21",
      description: "Adidas Ultraboost 21 với công nghệ đệm Boost mới nhất, mang lại sự thoải mái và hỗ trợ tối đa cho người chạy bộ.",
      price: 4500000,
      discountPrice: 4000000,
      countInStock: 30,
      sku: "AD-UB21-WHT-43",
      category: "Giày thể thao",
      brand: "Adidas",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Trắng",
      collection: "Ultraboost",
      material: "Primeknit, Boost",
      gender: "Men",
      images: [
        {
          url: "https://example.com/images/adidas-ultraboost-21-1.jpg",
          altText: "Adidas Ultraboost 21 - Góc nhìn chính"
        }
      ],
      isFeatured: true,
      isPublished: true,
      rating: 4.8,
      numReviews: 85,
      tags: ["Adidas", "Ultraboost", "Running", "Boost"],
      metaTitle: "Adidas Ultraboost 21 - Công nghệ Boost mới nhất",
      metaDescription: "Adidas Ultraboost 21 với đệm Boost được cải tiến, hỗ trợ tối đa cho người chạy bộ và vận động viên.",
      metaKeywords: ["Adidas", "Ultraboost 21", "giày chạy bộ", "Boost"],
      dimensions: {
        length: 31,
        width: 12,
        height: 15,
        weight: 0.38
      }
    },
    {
        "name": "Áo Thun Nam Uniqlo Dry Cotton Crew Neck",
        "description": "Áo thun nam Uniqlo chất liệu cotton cao cấp với công nghệ DRY nhanh khô, kiểu dáng cổ tròn cơ bản, phù hợp mặc hằng ngày.",
        "price": 399000,
        "discountPrice": 349000,
        "countInStock": 80,
        "sku": "UN-DCCN-BLK-M",
        "category": "Áo thun",
        "brand": "Uniqlo",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "color": "Đen",
        "collection": "Dry Cotton",
        "material": "100% Cotton",
        "gender": "Men",
        "images": [
          {
            "url": "https://example.com/images/uniqlo-dry-cotton-1.jpg",
            "altText": "Áo thun Uniqlo đen - Mặt trước"
          },
          {
            "url": "https://example.com/images/uniqlo-dry-cotton-2.jpg",
            "altText": "Áo thun Uniqlo đen - Mặt sau"
          },
          {
            "url": "https://example.com/images/uniqlo-dry-cotton-3.jpg", 
            "altText": "Áo thun Uniqlo - Cận chất vải"
          }
        ],
        "isFeatured": false,
        "isPublished": true,
        "rating": 4.2,
        "numReviews": 50,
        "tags": ["Uniqlo", "Áo thun", "Thời trang nam", "Hàng ngày"],
        "metaTitile": "Áo Thun Nam Uniqlo Dry Cotton Cổ Tròn",
        "metaDescription": "Mua áo thun nam Uniqlo DRY cotton cổ tròn chính hãng, thấm hút mồ hôi, thoải mái cả ngày.",
        "metaKeywords": ["áo thun", "Uniqlo", "áo nam", "cotton", "Dry"],
        "dimensions": {
          "length": 70,
          "width": 50,
          "height": 1,
          "weight": 0.2
        }
      },
      {
        "name": "Quần Jean Nữ Levi’s 501 Skinny",
        "description": "Mẫu quần jean ống ôm cổ điển Levi's 501 dành cho nữ với chất liệu denim co giãn, tôn dáng và thoải mái.",
        "price": 1690000,
        "discountPrice": 1490000,
        "countInStock": 35,
        "sku": "LV-501SK-BLU-28",
        "category": "Quần jean",
        "brand": "Levi's",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "color": "Xanh denim",
        "collection": "501",
        "material": "99% Cotton, 1% Elastane",
        "gender": "Women",
        "images": [
          {
            "url": "https://example.com/images/levis-501-skinny-1.jpg",
            "altText": "Quần jean Levi’s 501 skinny - Trước"
          },
          {
            "url": "https://example.com/images/levis-501-skinny-2.jpg",
            "altText": "Quần jean Levi’s 501 skinny - Sau"
          },
          {
            "url": "https://example.com/images/levis-501-skinny-3.jpg", 
            "altText": "Cận cảnh chất liệu denim"
          }
        ],
        "isFeatured": true,
        "isPublished": true,
        "rating": 4.7,
        "numReviews": 75,
        "tags": ["Levi's", "quần jean", "jeans nữ", "thời trang nữ"],
        "metaTitile": "Levi’s 501 Skinny - Quần Jean Nữ Ôm Cổ Điển",
        "metaDescription": "Khám phá mẫu quần jean Levi’s 501 skinny dành cho nữ, co giãn nhẹ, form đẹp, phong cách cổ điển.",
        "metaKeywords": ["Levi’s", "quần jean nữ", "jeans skinny", "501"],
        "dimensions": {
          "length": 100,
          "width": 35,
          "height": 2,
          "weight": 0.5
        }
      },
      {
        "name": "Áo Khoác Hoodie Nỉ Nam H&M Basic",
        "description": "Áo hoodie nam H&M Basic phong cách trẻ trung, chất nỉ mềm mại, giữ ấm tốt, phù hợp cho thời tiết se lạnh.",
        "price": 699000,
        "discountPrice": 599000,
        "countInStock": 60,
        "sku": "HM-HDBS-GRY-L",
        "category": "Áo khoác",
        "brand": "H&M",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "color": "Xám",
        "collection": "Basic Hoodie",
        "material": "60% Cotton, 40% Polyester",
        "gender": "Men",
        "images": [
          {
            "url": "https://example.com/images/hm-hoodie-basic-1.jpg",
            "altText": "Hoodie H&M màu xám - Chính diện"
          },
          {
            "url": "https://example.com/images/hm-hoodie-basic-2.jpg",
            "altText": "Hoodie H&M - Tay áo và túi"
          },
          {
            "url": "https://example.com/images/hm-hoodie-basic-3.jpg", 
            "altText": "Chất liệu nỉ mềm mịn"
          }
        ],
        "isFeatured": false,
        "isPublished": true,
        "rating": 4.3,
        "numReviews": 40,
        "tags": ["H&M", "hoodie", "áo khoác nam", "thời trang thu đông"],
        "metaTitile": "Áo Hoodie Nam H&M Basic Nỉ Mềm",
        "metaDescription": "Áo khoác hoodie H&M Basic dành cho nam, chất liệu nỉ mềm ấm áp, kiểu dáng basic dễ phối đồ.",
        "metaKeywords": ["H&M", "hoodie", "áo khoác nam", "nỉ", "Basic"],
        "dimensions": {
          "length": 75,
          "width": 55,
          "height": 2,
          "weight": 0.6
        }
      },
      {
        "name": "Áo Sơ Mi Nữ Zara Kẻ Sọc Dài Tay",
        "description": "Áo sơ mi nữ Zara với thiết kế kẻ sọc thanh lịch, form rộng hiện đại, phù hợp đi làm và đi chơi.",
        "price": 899000,
        "discountPrice": 749000,
        "countInStock": 45,
        "sku": "ZR-SMKS-BLU-M",
        "category": "Áo sơ mi",
        "brand": "Zara",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "color": "Xanh trắng sọc",
        "collection": "Office Style",
        "material": "65% Cotton, 35% Polyester",
        "gender": "Women",
        "images": [
          {
            "url": "https://example.com/images/zara-shirt-striped-1.jpg",
            "altText": "Áo sơ mi kẻ Zara - Mặt trước"
          },
          {
            "url": "https://example.com/images/zara-shirt-striped-2.jpg",
            "altText": "Áo sơ mi Zara - Form dáng"
          },
          {
            "url": "https://example.com/images/zara-shirt-striped-3.jpg",
            "altText": "Cận chất liệu cotton"
          }
        ],
        "isFeatured": true,
        "isPublished": true,
        "rating": 4.6,
        "numReviews": 65,
        "tags": ["Zara", "áo sơ mi", "thời trang nữ", "văn phòng"],
        "metaTitile": "Áo Sơ Mi Nữ Zara Kẻ Sọc",
        "metaDescription": "Sơ mi nữ Zara sọc thời trang, phù hợp mặc đi làm, form rộng trẻ trung.",
        "metaKeywords": ["Zara", "áo sơ mi nữ", "áo kẻ sọc", "thời trang công sở"],
        "dimensions": {
          "length": 68,
          "width": 50,
          "height": 1,
          "weight": 0.25
        }
      },
      {
        "name": "Váy Midi Tay Phồng Mango Trắng Kem",
        "description": "Váy midi Mango thiết kế tay phồng nhẹ, eo nhấn tinh tế, màu trắng kem thanh lịch thích hợp cho dự tiệc hoặc đi chơi.",
        "price": 1390000,
        "discountPrice": 1250000,
        "countInStock": 20,
        "sku": "MG-MDWP-WHT-S",
        "category": "Váy",
        "brand": "Mango",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "color": "Trắng kem",
        "collection": "Spring Elegance",
        "material": "100% Polyester",
        "gender": "Women",
        "images": [
          {
            "url": "https://example.com/images/mango-midi-dress-1.jpg",
            "altText": "Váy Mango trắng kem - Toàn thân"
          },
          {
            "url": "https://example.com/images/mango-midi-dress-2.jpg",
            "altText": "Váy Mango - Eo nhấn"
          },
          {
            "url": "https://example.com/images/mango-midi-dress-3.jpg",
            "altText": "Chất liệu mềm mịn"
          }
        ],
        "isFeatured": true,
        "isPublished": true,
        "rating": 4.9,
        "numReviews": 30,
        "tags": ["Mango", "váy midi", "thời trang nữ", "trắng kem"],
        "metaTitile": "Váy Midi Tay Phồng Mango",
        "metaDescription": "Váy tay phồng Mango màu trắng kem sang trọng, tôn dáng, phong cách thanh lịch dịu dàng.",
        "metaKeywords": ["Mango", "váy midi", "váy dự tiệc", "váy trắng"],
        "dimensions": {
          "length": 110,
          "width": 45,
          "height": 2,
          "weight": 0.4
        }
      },
      {
        "name": "Quần Short Kaki Nam Routine Basic",
        "description": "Quần short kaki nam Routine kiểu dáng basic, chất liệu thoáng mát, phù hợp mặc đi chơi, dạo phố hoặc thể thao nhẹ.",
        "price": 499000,
        "discountPrice": 449000,
        "countInStock": 70,
        "sku": "RT-KKSH-NVY-32",
        "category": "Quần short",
        "brand": "Routine",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "color": "Xanh navy",
        "collection": "Basic Man",
        "material": "98% Cotton, 2% Spandex",
        "gender": "Men",
        "images": [
          {
            "url": "https://example.com/images/routine-short-kaki-1.jpg",
            "altText": "Quần short kaki Routine - Chính diện"
          },
          {
            "url": "https://example.com/images/routine-short-kaki-2.jpg",
            "altText": "Chi tiết túi và đường may"
          },
          {
            "url": "https://example.com/images/routine-short-kaki-3.jpg",
            "altText": "Chất liệu kaki co giãn"
          }
        ],
        "isFeatured": false,
        "isPublished": true,
        "rating": 4.1,
        "numReviews": 25,
        "tags": ["Routine", "quần short", "kaki", "thời trang nam"],
        "metaTitile": "Quần Short Kaki Routine Basic Nam",
        "metaDescription": "Quần kaki ngắn nam Routine, dáng basic, co giãn nhẹ, thoáng mát cho mùa hè.",
        "metaKeywords": ["Routine", "quần short nam", "kaki", "casual wear"],
        "dimensions": {
          "length": 55,
          "width": 35,
          "height": 2,
          "weight": 0.3
        }
      }
      
  ];
  
  module.exports = products;