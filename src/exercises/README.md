# Video Events Interview Practice

## Overview

This practice environment simulates the paired programming exercise you'll encounter in your technical interview. You'll be working with **event-based data** from a video commerce platform.

---

## Part 1: Paired Programming Exercise

### The Scenario

You're building analytics for a video commerce platform where users watch videos that feature shoppable products. Every user interaction generates an event:

- `video_play` - User started watching
- `video_pause` - User paused
- `video_complete` - User finished watching
- `product_click` - User clicked on a product
- `product_hover` - User showed interest
- `add_to_cart` - User added to cart
- `purchase` - User bought something

### Your Tasks

Open `src/exercises/eventAggregator.ts` and work through:

1. **Exercise 1**: Aggregate user engagement metrics
2. **Exercise 2**: Calculate product performance
3. **Exercise 3**: Build video analytics
4. **Exercise 4**: Create session summaries

### Tips for Success

- **Read the event summary carefully** - Understand what each event type means
- **Don't rush** - Take time to understand the big picture
- **Talk out loud** - Explain your thinking as you code
- **Ask questions** - Clarify requirements before diving in
- **Consider edge cases** - Empty arrays, missing data, division by zero

---

## Part 2: System Design Discussion

After the coding exercise, be prepared to discuss:

### Scaling the Solution

- How would you handle **millions of events per day**?
- Where would you add **caching** (and what caching strategy)?
- How would you **partition** the data?
- What **indexes** would help query performance?

### Architecture Considerations

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│    API      │────▶│  Database   │
│  (Events)   │     │  Gateway    │     │  (Events)   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Stream    │
                    │  Processor  │
                    └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Cache   │ │  Search  │ │Analytics │
        │ (Redis)  │ │(Elastic) │ │   DW     │
        └──────────┘ └──────────┘ └──────────┘
```

### Caching Strategies to Know

1. **Cache-Aside (Lazy Loading)**
   - Read: Check cache → Miss → Query DB → Populate cache
   - Simple but can have thundering herd problem

2. **Write-Through**
   - Write: Update DB → Update cache
   - Consistent but slower writes

3. **Write-Behind (Write-Back)**
   - Write: Update cache → Async update DB
   - Fast writes, eventual consistency

4. **Time-To-Live (TTL)**
   - Set expiration on cached aggregations
   - Balance freshness vs performance

### Frontend/Product Thinking

Be ready to discuss:

- How would you **present this data** to different users (analysts, marketers, execs)?
- What **visualizations** work best for funnel data?
- How do you balance **real-time** vs **batch** analytics?
- What **alerts** might be useful?

---

## Practice Runs

### Run 1: Basic Implementation (30 min)
- Implement Exercise 1 (User Engagement)
- Focus on getting the logic right
- Talk through your approach

### Run 2: Full Implementation (45 min)
- Complete all 4 exercises
- Refactor for cleanliness
- Add error handling

### Run 3: Timed Simulation (60 min)
- Pretend it's the real interview
- Complete what you can
- Prepare to discuss trade-offs

---

## Key Things to Remember

> "They aren't trying to catch you out. More focused on how you approach problem solving, how you communicate and collaborate."

1. **Communication is key** - Explain your thinking
2. **Ask clarifying questions** - Don't assume
3. **Start simple** - Get something working, then optimize
4. **Discuss trade-offs** - There's rarely one right answer
5. **Stay calm** - It's a conversation, not an exam

Good luck! 🚀
