import CarouselLayout from "./../src/FaqTestimonialBuilder";
import HScrollLayout from "./../src/FaqTestimonialBuilder";
import SingleQuoteLayout from "./../src/FaqTestimonialBuilder";
import ListFeedLayout from "./../src/FaqTestimonialBuilder";
import InlineAvatarLayout from "./../src/FaqTestimonialBuilder";
import CardGridLayout from "./../src/FaqTestimonialBuilder";

export default function TestiPreview({ items, count, cfg }) {
  const vis = items.slice(0, count);
  switch (cfg.layout) {
    case "carousel":
      return <CarouselLayout items={vis} cfg={cfg} />;
    case "h-scroll":
      return <HScrollLayout items={vis} cfg={cfg} />;
    case "single-quote":
      return <SingleQuoteLayout items={vis} cfg={cfg} />;
    case "list":
      return <ListFeedLayout items={vis} cfg={cfg} />;
    case "inline-avatar":
      return <InlineAvatarLayout items={vis} cfg={cfg} />;
    default:
      return <CardGridLayout items={vis} cfg={cfg} />;
  }
}
