import { Leaf, Heart, Users, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Chef Maria Rodriguez",
      role: "Executive Chef & Founder",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      description: "15+ years experience in Michelin-starred restaurants across Europe. Specializes in modern interpretations of classic cuisine."
    },
    {
      name: "Chef James Parker",
      role: "Head Pastry Chef",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      description: "Award-winning pastry chef known for innovative dessert creations and artisanal bread making techniques."
    },
    {
      name: "Chef Sarah Chen",
      role: "Sous Chef",
      image: "https://images.unsplash.com/photo-1594736797933-d0101ba691fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      description: "Expert in Asian fusion cuisine with a passion for locally-sourced ingredients and sustainable cooking practices."
    }
  ];

  const values = [
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to eco-friendly practices and supporting local farmers"
    },
    {
      icon: Heart,
      title: "Quality",
      description: "Using only the finest ingredients and proven cooking techniques"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections through shared meals and experiences"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly evolving our menu and improving our service"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Our Story</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Discover the passion, tradition, and culinary excellence that drives everything we do at Savory Delights.
          </p>
        </div>

        {/* Restaurant Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-6">From Humble Beginnings</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in 2015 by Chef Maria Rodriguez, Savory Delights began as a small family kitchen with a big dream: 
              to bring restaurant-quality gourmet meals directly to your home. What started as weekend farmer's market 
              pop-ups has grown into a premier culinary destination.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our commitment to fresh, locally-sourced ingredients and innovative cooking techniques has earned us 
              recognition from food critics and loyal customers alike. Every dish tells a story of craftsmanship, 
              creativity, and care.
            </p>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">8+</div>
                <div className="text-gray-600 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">200+</div>
                <div className="text-gray-600 text-sm">Signature Dishes</div>
              </div>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Restaurant Interior"
              className="rounded-xl shadow-2xl w-full"
            />
          </div>
        </div>

        {/* Chef Team */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Meet Our Culinary Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The talented chefs behind every exceptional dish, bringing years of experience and passion to your table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-secondary mb-2">{member.name}</h3>
              <p className="text-primary font-semibold mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.description}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="bg-cream rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do, from ingredient selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-secondary mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
